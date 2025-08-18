import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "./theme-context";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  pomoDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  maxSessions: number;
  setPomoDuration: React.Dispatch<React.SetStateAction<number>>;
  setBreakDuration: React.Dispatch<React.SetStateAction<number>>;
  setLongBreakDuration: React.Dispatch<React.SetStateAction<number>>;
  setMaxSessions: React.Dispatch<React.SetStateAction<number>>;
}

export default function SettingsModal({
  visible,
  onClose,
  onSave,
  pomoDuration,
  breakDuration,
  longBreakDuration,
  maxSessions,
  setPomoDuration,
  setBreakDuration,
  setLongBreakDuration,
  setMaxSessions,
}: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (!visible) return null;

  return (
    <BlurView
      intensity={110}
      tint={isDark ? "dark" : "light"}
      className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center px-6"
    >
      <View
        className={`${
          isDark ? "bg-black/70" : "bg-gray-200"
        } p-6 rounded-2xl w-full max-w-md`}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`${
              isDark ? "text-white" : "text-black"
            } text-lg font-semibold`}
          >
            Settings
          </Text>
          <Pressable onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </Pressable>
        </View>

        {/* Settings fields */}
        <View className="space-y-3">
          <View>
            <Text className={`${isDark ? "text-white" : "text-black"} mb-1`}>
              Pomodoro Duration (minutes)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={pomoDuration.toString()}
              onChangeText={(text) => setPomoDuration(Number(text) || 0)}
              className={`${
                isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"
              } p-2 rounded-xl`}
            />
          </View>

          <View>
            <Text className={`${isDark ? "text-white" : "text-black"} mb-1`}>
              Short Break Duration (minutes)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={breakDuration.toString()}
              onChangeText={(text) => setBreakDuration(Number(text) || 0)}
              className={`${
                isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"
              } p-2 rounded-xl`}
            />
          </View>

          <View>
            <Text className={`${isDark ? "text-white" : "text-black"} mb-1`}>
              Long Break Duration (minutes)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={longBreakDuration.toString()}
              onChangeText={(text) => setLongBreakDuration(Number(text) || 0)}
              className={`${
                isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"
              } p-2 rounded-xl`}
            />
          </View>

          <View>
            <Text className={`${isDark ? "text-white" : "text-black"} mb-1`}>
              Max Sessions
            </Text>
            <TextInput
              keyboardType="numeric"
              value={maxSessions.toString()}
              onChangeText={(text) => setMaxSessions(Number(text) || 0)}
              className={`${
                isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"
              } p-2 rounded-xl`}
            />
          </View>

          {/* Dark theme toggle */}
          <View className="flex-row items-center justify-between pt-2">
            <Text className={`${isDark ? "text-white" : "text-black"}`}>
              Dark Theme
            </Text>
            <Pressable onPress={toggleTheme}>
              <Ionicons
                name={isDark ? "checkmark-circle" : "ellipse-outline"}
                size={28}
                color={isDark ? "white" : "black"}
              />
            </Pressable>
          </View>
        </View>

        {/* Save button */}
        <Pressable
          onPress={onSave}
          className={`mt-6 py-3 rounded-xl items-center ${
            isDark ? "bg-white/20" : "bg-black/20"
          }`}
        >
          <Text className={`${isDark ? "text-white" : "text-black"}`}>
            Save
          </Text>
        </Pressable>
      </View>
    </BlurView>
  );
}
