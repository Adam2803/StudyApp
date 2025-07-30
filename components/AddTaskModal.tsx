import React, { forwardRef, useMemo, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/components/theme-context";

type AddTaskModalProps = {
  onAddTask: (task: {
    title: string;
    description: string;
    tag: string;
  }) => void;
};

const AddTaskModal = forwardRef<BottomSheetModal, AddTaskModalProps>(
  ({ onAddTask }, ref) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const { theme } = useTheme();

    const isDark = theme === "dark";
    const snapPoints = useMemo(() => ["50%"], []);

    const handleAdd = () => {
      if (!title.trim()) return;

      onAddTask({ title, description, tag });

      // Clear inputs
      setTitle("");
      setDescription("");
      setTag("");

      // Close modal
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        }}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <Text className="text-lg font-semibold mb-2 text-black dark:text-white">
            Add New Task
          </Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            className="border rounded-lg px-3 py-2 mb-3 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholderTextColor={isDark ? "#999" : "#aaa"}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            className="border rounded-lg px-3 py-2 mb-3 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholderTextColor={isDark ? "#999" : "#aaa"}
          />

          <TextInput
            placeholder="Tag (e.g., Work, Personal)"
            value={tag}
            onChangeText={setTag}
            className="border rounded-lg px-3 py-2 mb-4 text-black dark:text-white border-gray-300 dark:border-gray-600"
            placeholderTextColor={isDark ? "#999" : "#aaa"}
          />

          <TouchableOpacity
            onPress={handleAdd}
            className="bg-blue-600 rounded-xl py-3"
          >
            <Text className="text-white text-center font-semibold">
              Add Task
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default AddTaskModal;
