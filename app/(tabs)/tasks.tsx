// app/(tabs)/tasks.tsx
import AddTaskModal from "@/components/AddTaskModal";
import FloatingActionButton from "@/components/FloatingActionButton";
import TaskItem from "@/components/TaskItem";
import { useTheme } from "@/components/theme-context";
import { Task, useTaskStore } from "@/lib/task-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { FlatList, Text, View } from "react-native";

export default function TasksScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { tasks, addTask, deleteTask, editTask, toggleTask } = useTaskStore();

  const handleOpenModal = () => {
    bottomSheetRef.current?.present();
  };

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    addTask(newTask);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <View className={`flex-1 px-4 pt-4 ${isDark ? "bg-black" : "bg-white"}`}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onEdit={(updated) => editTask(item.id, updated)}
          />
        )}
        ListEmptyComponent={() => (
          <Text className="text-center mt-10 text-gray-500">No tasks yet.</Text>
        )}
      />

      <FloatingActionButton onPress={handleOpenModal} />
      <AddTaskModal ref={bottomSheetRef} onAddTask={handleAddTask} />
    </View>
  );
}
