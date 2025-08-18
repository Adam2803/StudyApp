import AddTaskModal from "@/components/AddTaskModal";
import FloatingActionButton from "@/components/FloatingActionButton";
import TaskItem from "@/components/TaskItem";
import { useTheme } from "@/components/theme-context";
import { Colors } from "@/constants/Colors"; // ✅ import your theme colors
import { useTaskStore } from "@/lib/task-store";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { FlatList, Text, View } from "react-native";

type NewTaskPayload = {
  title: string;
  description: string;
  tag: string;
};

export default function TasksScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme]; // ✅ use central Colors
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { tasks, addTask, deleteTask, editTask, toggleTask } = useTaskStore();

  const handleOpenModal = () => {
    bottomSheetRef.current?.present();
  };

  const handleAddTask = (newTask: NewTaskPayload) => {
    addTask(newTask);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <View
      className="flex-1 px-4 pt-4"
      style={{ backgroundColor: colors.background }} // ✅ theme background
    >
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
