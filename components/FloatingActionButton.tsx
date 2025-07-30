import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useTheme } from "@/components/theme-context";

interface FloatingActionButtonProps {
  onPress: () => void;
}

const FloatingActionButton = ({ onPress }: FloatingActionButtonProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 300 }}
      className="absolute bottom-6 right-6"
    >
      <TouchableOpacity
        onPress={onPress}
        className={`w-16 h-16 rounded-full items-center justify-center shadow-md ${
          isDark ? "bg-blue-600" : "bg-blue-500"
        }`}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </MotiView>
  );
};

export default FloatingActionButton;
