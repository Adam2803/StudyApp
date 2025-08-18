import { useTheme } from "@/components/theme-context";
import React from "react";
import { View } from "react-native";

export default function TabBarBackgroundComponent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      className={`absolute bottom-0 w-full h-16 z-[-1] ${
        isDark ? "bg-black" : "bg-white"
      }`}
    />
  );
}
