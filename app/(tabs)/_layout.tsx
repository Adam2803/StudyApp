import { Tabs } from "expo-router";
import React from "react";
import { Platform, SafeAreaView } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { useTheme } from "@/components/theme-context";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function TabLayout() {
  const { theme } = useTheme();

  console.log("theme", theme);
  console.log("Colors[theme]", Colors[theme]);

  const isDark = theme === "dark";

  return (
    // Wrap the entire component in a SafeAreaView with a matching background color
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#000" : "#fff" }}
    >
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[theme].tint,
            headerShown: true,
            tabBarButton: HapticTab,
            tabBarBackground: () => <TabBarBackground />,
            tabBarStyle: Platform.select({
              ios: {
                position: "absolute",
                backgroundColor: isDark ? "#000" : "#fff",
              },
              default: {
                backgroundColor: isDark ? "#000" : "#fff",
              },
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
                <Ionicons
                  name="checkmark-done-outline"
                  size={24}
                  color={color}
                />
              ),
              tabBarLabel: "",
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
