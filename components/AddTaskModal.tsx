import { useTheme } from "@/components/theme-context";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity } from "react-native";

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

    const bottomSheetRef = ref as React.RefObject<BottomSheetModal>;
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const snapPoints = useMemo(() => ["75%", "80%"], []);

    useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => {
        bottomSheetRef.current?.snapToIndex(1);
      });

      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        bottomSheetRef.current?.snapToIndex(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    const handleAdd = () => {
      if (!title.trim()) return;
      const newTag = tag.trim() || "personal";
      onAddTask({ title, description, tag: newTag });
      setTitle("");
      setDescription("");
      setTag("");
      bottomSheetRef.current?.dismiss();
    };

    const textColor = isDark ? "text-white" : "text-black";
    const placeholderColor = isDark ? "#d1d5db" : "#9ca3af";
    const inputBorderColor = isDark ? "border-gray-600" : "border-gray-300";

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        backgroundStyle={{
          backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
        }}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <Text className={`text-lg font-semibold mb-2 ${textColor}`}>
            Add New Task
          </Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
            className={`border rounded-lg px-3 py-2 mb-3 ${textColor} ${inputBorderColor}`}
            placeholderTextColor={placeholderColor}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
            className={`border rounded-lg px-3 py-2 mb-3 ${textColor} ${inputBorderColor}`}
            placeholderTextColor={placeholderColor}
          />

          <TextInput
            placeholder="Tag (e.g., Work, Personal)"
            value={tag}
            onChangeText={setTag}
            onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
            className={`border rounded-lg px-3 py-2 mb-4 ${textColor} ${inputBorderColor}`}
            placeholderTextColor={placeholderColor}
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
