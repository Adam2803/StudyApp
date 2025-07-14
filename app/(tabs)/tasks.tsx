// File: app/(tabs)/todo.tsx

import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";

type Task = {
  id: string;
  user_id?: string;
  content: string;
  is_complete: boolean;
};

export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState<string>("");

  const TASKS_KEY = "@local_tasks";

  useEffect(() => {
    const loadFromStorage = async () => {
      const stored = await AsyncStorage.getItem(TASKS_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    };

    loadFromStorage();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchAndMergeTasks(user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const fetchAndMergeTasks = async (uid: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", uid);

    if (error) return Alert.alert("Fetch error", error.message);

    const merged = [...tasks];
    data?.forEach((remoteTask) => {
      const exists = tasks.some((t) => t.content === remoteTask.content);
      if (!exists) merged.push(remoteTask);
    });
    setTasks(merged);
  };

  const startSyncTimer = () => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(
      syncTasksToSupabase,
      5 * 60 * 1000
    ) as unknown as NodeJS.Timeout;
  };

  const syncTasksToSupabase = async () => {
    if (!userId) return;
    for (const task of tasks) {
      if (!task.user_id) {
        const { error } = await supabase.from("tasks").upsert({
          user_id: userId,
          content: task.content,
          is_complete: task.is_complete,
        });
        if (error) console.log("Sync error:", error.message);
      }
    }
  };

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: uuid.v4().toString(),
      content: input.trim(),
      is_complete: false,
    };
    setTasks([newTask, ...tasks]);
    setInput("");
    startSyncTimer();
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_complete: !t.is_complete } : t))
    );
    startSyncTimer();
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (userId) supabase.from("tasks").delete().eq("id", id);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditText(task.content);
  };

  const saveEdit = async () => {
    if (!editingTask) return;

    const updated = tasks.map((t) =>
      t.id === editingTask.id ? { ...t, content: editText } : t
    );
    setTasks(updated);

    if (userId) {
      const { error } = await supabase
        .from("tasks")
        .update({ content: editText })
        .eq("id", editingTask.id);
      if (error) Alert.alert("Edit Error", error.message);
    }

    setEditingTask(null);
    setEditText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>📝 Your Daily Tasks</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              onPress={() => toggleTask(item.id)}
              style={[
                styles.checkbox,
                item.is_complete && styles.checkboxChecked,
              ]}
            />
            <Text
              style={[styles.taskText, item.is_complete && styles.taskTextDone]}
            >
              {item.content}
            </Text>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <Text style={{ marginHorizontal: 8 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
        }
      />

      <Modal visible={!!editingTask} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.input}
              value={editText}
              onChangeText={setEditText}
              placeholder="Edit task name..."
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditingTask(null)} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    backgroundColor: "#228B22",
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#228B22",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteText: {
    fontSize: 18,
    marginLeft: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
