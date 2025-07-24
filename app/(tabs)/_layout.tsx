import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useTheme } from "@/components/theme-context"; // ✅ use your custom theme context
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { theme } = useTheme(); // ✅ not useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: "Pomodoro",
          headerStyle: {
            backgroundColor: Colors[theme].header, // ✅ dynamic header background
          },
          headerTintColor: theme === "dark" ? "#fff" : "#000",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          headerStyle: {
            backgroundColor: Colors[theme].header, // ✅ ensure it's synced too
          },
          headerTintColor: theme === "dark" ? "#fff" : "#000",
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done-outline" size={24} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
}
