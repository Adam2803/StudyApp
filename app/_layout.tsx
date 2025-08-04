import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from "@/components/theme-context";
import { supabase } from "@/lib/supabase";
import { TaskContext } from "@/lib/task-context"; // ✅ ADD THIS
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "./globals.css";

// ✅ Define your Task type
type Task = {
  id: string;
  title: string;
  description: string;
  tag: string;
  completed: boolean;
};

export default function RootLayoutWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <BottomSheetModalProvider>
          <RootLayout />
        </BottomSheetModalProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { theme } = useTheme();
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const navigationState = useRootNavigationState();

  // ✅ Task state for context
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsSignedIn(!!data.session);
    };
    checkSession();
  }, []);

  if (!loaded || isSignedIn === null) return null;

  return (
    <NavigationThemeProvider
      value={theme === "dark" ? DarkTheme : DefaultTheme}
    >
      {/* ✅ Wrap Stack + StatusBar in TaskContext.Provider */}
      <TaskContext.Provider value={{ tasks, setTasks }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/profile" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="task/[id]"
            options={{
              title: "Task Details", // Or whatever you prefer
              headerTintColor: theme === "dark" ? "#fff" : "#000",
              headerStyle: {
                backgroundColor: theme === "dark" ? "#000" : "#fff", // Set header background color
              },
            }}
          />
        </Stack>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
      </TaskContext.Provider>
    </NavigationThemeProvider>
  );
}
