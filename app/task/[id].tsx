import { useTheme } from "@/components/theme-context";
import { useTaskStore } from "@/lib/task-store";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const { tasks, editTask } = useTaskStore();
  const { theme } = useTheme();

  const task = tasks.find((t) => t.id === id);

  const [editingField, setEditingField] = useState<
    "title" | "description" | "tag" | null
  >(null);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tag, setTag] = useState(task?.tag || "personal");

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-lg text-gray-400">Task not found.</Text>
      </View>
    );
  }

  const saveField = () => {
    editTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      tag: tag.trim() || "personal",
    });
    setEditingField(null);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        if (editingField) saveField();
      }}
    >
      <View
        className={`flex-1 p-4 ${
          theme === "dark" ? "bg-card-dark" : "bg-gray-100"
        }`}
      >
        {/* Tag */}
        {editingField === "tag" ? (
          <TextInput
            value={tag}
            onChangeText={setTag}
            onBlur={saveField}
            autoFocus
            className="text-md text-gray-600 dark:text-gray-300 mb-2"
            placeholder="Tag (e.g. personal)"
            placeholderTextColor="#9ca3af"
            style={{ padding: 0, margin: 0, lineHeight: 20 }}
          />
        ) : (
          <Text
            className={`text-md mb-2 ${
              tag ? "text-gray-600 dark:text-gray-300" : "text-gray-400"
            }`}
            style={{ lineHeight: 20 }}
            onPress={() => setEditingField("tag")}
          >
            {tag || "Tag (e.g. personal)"}
          </Text>
        )}

        {/* Title */}
        {editingField === "title" ? (
          <TextInput
            value={title}
            onChangeText={setTitle}
            onBlur={saveField}
            autoFocus
            className="text-2xl font-bold text-black dark:text-white mb-2"
            placeholder="What would you like to do?"
            placeholderTextColor="#d1d5db"
            style={{ padding: 0, margin: 0, lineHeight: 32 }}
          />
        ) : (
          <Text
            className={`text-2xl font-bold mb-2 ${
              title ? "text-black dark:text-white" : "text-gray-300"
            }`}
            style={{ lineHeight: 32 }}
            onPress={() => setEditingField("title")}
          >
            {title || "What would you like to do?"}
          </Text>
        )}

        {/* Description */}
        {editingField === "description" ? (
          <TextInput
            value={description}
            onChangeText={setDescription}
            onBlur={saveField}
            autoFocus
            multiline
            className="text-base text-black dark:text-white"
            placeholder="Description"
            placeholderTextColor="#d1d5db"
            style={{ padding: 0, margin: 0, lineHeight: 24 }}
          />
        ) : (
          <Text
            className={`text-base ${
              description ? "text-black dark:text-white" : "text-gray-300"
            }`}
            style={{ lineHeight: 24 }}
            onPress={() => setEditingField("description")}
          >
            {description || "Description"}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
