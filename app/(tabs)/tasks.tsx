// File: app/(tabs)/todo.tsx

import { useTheme } from "@/components/theme-context";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState<string>("");

  const TASKS_KEY = "@local_tasks";

  // 🧠 Top header appearance setup
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Tasks",
      headerStyle: {
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      },
      headerTintColor: theme === "dark" ? "#ffffff" : "#000000",
    });
  }, [navigation, isDark]);

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
    <View className={`flex-1 px-4 pt-16 bg-primary dark:bg-primary-dark`}>
      <Text
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        📝 Your Daily Tasks
      </Text>
      <View className="flex-row mb-4">
        <TextInput
          className={`flex-1 rounded-lg px-3 py-2 border text-base ${
            isDark
              ? "bg-card-dark text-white border-[#444]"
              : "bg-white text-black border-gray-300"
          }`}
          placeholder="Add new task..."
          placeholderTextColor={isDark ? "#aaa" : "#888"}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          className="ml-2 rounded-lg px-4 justify-center items-center bg-accent"
          onPress={addTask}
        >
          <Text className="text-white text-2xl font-bold">＋</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`flex-row items-center p-3 rounded-lg mb-2  ${
              isDark
                ? "bg-card-dark text-white border-[#e25656]"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <TouchableOpacity
              onPress={() => toggleTask(item.id)}
              className={`w-5 h-5 mr-3 border-2 rounded ${
                item.is_complete ? "bg-accent" : ""
              } ${isDark ? "border-gray-400" : "border-gray-600"}`}
            />
            <Text
              className={`flex-1 text-base ${
                item.is_complete
                  ? "line-through text-gray-400"
                  : isDark
                  ? "text-white "
                  : "text-gray-800 "
              }`}
            >
              87
              {item.content}
            </Text>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <Text className="mx-2">✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text
            className={`text-center mt-10 ${
              isDark
                ? "bg-input-dark text-white border-[#444]"
                : "bg-white text-black border-gray-300"
            }`}
          >
            No tasks yet. Add one above!
          </Text>
        }
      />
      {/* -----------------Setting Edit Modal----------------------- */}
      <Modal visible={!!editingTask} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black/50 p-5">
          <View className="bg-white dark:bg-muted-dark p-5 rounded-2xl">
            <Text className="text-lg font-bold mb-3 text-secondary dark:text-secondary-dark">
              Edit Task
            </Text>
            <TextInput
              className="bg-input dark:bg-input-dark text-secondary dark:text-secondary-dark border border-border dark:border-border-dark rounded-lg px-3 py-2"
              value={editText}
              onChangeText={setEditText}
              placeholder="Edit task name..."
              placeholderTextColor={isDark ? "#aaa" : "#888"}
            />
            <View className="flex-row justify-between mt-4">
              <Button title="Cancel" onPress={() => setEditingTask(null)} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
