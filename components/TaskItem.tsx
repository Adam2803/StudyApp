import { useTheme } from "@/components/theme-context";
import { Task } from "@/lib/task-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

type Props = {
  task: Task;
  onToggle: () => void;
  onEdit: (updated: {
    title: string;
    description: string;
    tag: string;
  }) => void;
  onDelete: () => void;
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/task/${task.id}`)}
      className="active:opacity-80"
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 300 }}
        className={`rounded-2xl p-4 mb-3 ${
          isDark ? "bg-neutral-800" : "bg-white"
        } shadow-lg`}
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"
            }`}
          >
            {task.tag}
          </Text>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={isDark ? "#f87171" : "#dc2626"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onToggle}
          className="flex-row items-start mt-1"
        >
          {/* ✅ Checkbox using Ionicons */}
          <View className="mr-3 mt-1">
            {task.completed ? (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color={isDark ? "#22c55e" : "#16a34a"}
              />
            ) : (
              <Ionicons name="ellipse-outline" size={25} color="#9ca3af" />
            )}
          </View>

          <View className="flex-1">
            <Text
              className={`text-base font-bold ${
                task.completed
                  ? "line-through text-gray-400"
                  : isDark
                    ? "text-white"
                    : "text-black"
              }`}
            >
              {task.title}
            </Text>
            {task.description.length > 0 && (
              <Text
                className={`text-sm mt-1 ${
                  task.completed
                    ? "line-through text-gray-400"
                    : isDark
                      ? "text-gray-300"
                      : "text-gray-700"
                }`}
              >
                {task.description}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </MotiView>
    </Pressable>
  );
}
