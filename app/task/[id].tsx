import { useTheme } from "@/components/theme-context";
import { useTaskStore } from "@/lib/task-store";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TaskDetailScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, editTask } = useTaskStore();
  const task = tasks.find((t) => t.id === id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingTag, setIsEditingTag] = useState(false);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tag, setTag] = useState(task?.tag || "");

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Task not found</Text>
      </View>
    );
  }

  const saveTitle = () => {
    editTask(task.id, { title });
    setIsEditingTitle(false);
  };

  const saveDescription = () => {
    editTask(task.id, { description });
    setIsEditingDesc(false);
  };

  const saveTag = () => {
    editTask(task.id, { tag });
    setIsEditingTag(false);
  };

  return (
    <ScrollView
      className={`flex-1 p-4 ${isDark ? "bg-black" : "bg-white"}`}
      keyboardShouldPersistTaps="handled"
    >
      {/* Tag */}
      <View style={{ marginBottom: 16 }}>
        {isEditingTag ? (
          <TextInput
            value={tag}
            onChangeText={setTag}
            onBlur={saveTag}
            autoFocus
            style={{
              backgroundColor: isDark ? "#333" : "#eee",
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              color: isDark ? "#fff" : "#000",
              fontSize: 14,
              alignSelf: "flex-start",
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditingTag(true)}
            style={{
              backgroundColor: isDark ? "#333" : "#eee",
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#fff" : "#000",
              }}
            >
              {tag || "Tag (e.g. personal)"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <View style={{ minHeight: 40, justifyContent: "center" }}>
        {isEditingTitle ? (
          <TextInput
            value={title}
            onChangeText={setTitle}
            onBlur={saveTitle}
            autoFocus
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingVertical: 4,
              color: isDark ? "#fff" : "#000",
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingVertical: 4,
              color: isDark ? "#fff" : "#000",
            }}
            onPress={() => setIsEditingTitle(true)}
          >
            {title || "Untitled Task"}
          </Text>
        )}
      </View>

      {/* Description */}
      <View style={{ minHeight: 40, justifyContent: "center", marginTop: 16 }}>
        {isEditingDesc ? (
          <TextInput
            value={description}
            onChangeText={setDescription}
            onBlur={saveDescription}
            autoFocus
            multiline
            style={{
              fontSize: 16,
              paddingVertical: 4,
              color: isDark ? "#ddd" : "#333",
              textAlignVertical: "top",
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              paddingVertical: 4,
              color: isDark ? "#ddd" : "#333",
            }}
            onPress={() => setIsEditingDesc(true)}
          >
            {description || "No description"}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
