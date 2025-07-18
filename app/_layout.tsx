import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from "@/components/theme-context";
import { supabase } from "@/lib/supabase";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "./globals.css";

export default function RootLayoutWrapper() {
  return (
    <AppThemeProvider>
      <RootLayout />
    </AppThemeProvider>
  );
}

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { theme } = useTheme();
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const navigationState = useRootNavigationState();

  // ✅ Check if user is signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsSignedIn(!!data.session);
    };
    checkSession();
  }, []);

  // Optional: Redirect if not signed in
  // useEffect(() => {
  //   if (navigationState?.key && isSignedIn === false) {
  //     router.replace("/auth/login");
  //   }
  // }, [isSignedIn, navigationState]);

  if (!loaded || isSignedIn === null) return null;

  return (
    <NavigationThemeProvider
      value={theme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}
