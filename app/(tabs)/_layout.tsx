import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/HapticTab";
import { useTheme } from "@/components/theme-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const { theme } = useTheme();

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
            backgroundColor: Colors[theme].header,
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
            backgroundColor: Colors[theme].header,
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
