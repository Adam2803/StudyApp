import { useTheme } from "@/components/theme-context";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";

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
      // Don't add a task if the title is empty
      if (!title.trim()) return;

      // Use "personal" as the default tag if the user hasn't entered anything
      const newTag = tag.trim() || "personal";

      onAddTask({ title, description, tag: newTag });

      // Clear inputs
      setTitle("");
      setDescription("");
      setTag("");

      // Close modal
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    // Define colors once to keep the code clean
    const textColor = isDark ? "text-white" : "text-black";
    const placeholderColor = isDark ? "#d1d5db" : "#9ca3af";
    const inputBorderColor = isDark ? "border-gray-600" : "border-gray-300";

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        }}
        keyboardBehavior="interactive" // FIX: This is the key prop
        android_keyboardInputMode="adjustResize" // BEST PRACTICE: For Android
      >
        <BottomSheetView style={{ padding: 20 }}>
          {/* Add New Task text */}
          <Text className={`text-lg font-semibold mb-2 ${textColor}`}>
            Add New Task
          </Text>

          {/* Title Input */}
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            className={`border rounded-lg px-3 py-2 mb-3 ${textColor} ${inputBorderColor}`}
            placeholderTextColor={placeholderColor}
          />

          {/* Description Input */}
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            className={`border rounded-lg px-3 py-2 mb-3 ${textColor} ${inputBorderColor}`}
            placeholderTextColor={placeholderColor}
          />

          {/* Tag Input */}
          <TextInput
            placeholder="Tag (e.g., Work, Personal)"
            value={tag}
            onChangeText={setTag}
            className={`border rounded-lg px-3 py-2 mb-4 ${textColor} ${inputBorderColor}`}
            placeholderTextColor={placeholderColor}
          />

          {/* Add Task Button */}
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
