import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ambientSounds } from "@/ambientSounds"; // ✅ Import the auto-generated ambientSounds
import { useTheme } from "./theme-context";

interface AmbientSoundModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AmbientSoundModal({
  visible,
  onClose,
}: AmbientSoundModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentSoundId, setCurrentSoundId] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playSound = async (soundId: string) => {
    // Stop any currently playing sound
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const soundToPlay = ambientSounds.find((s) => s.id === soundId);

    if (!soundToPlay) return; // Exit if the sound isn't found

    const { sound } = await Audio.Sound.createAsync(soundToPlay.file, {
      isLooping: true,
      volume: 0.8,
    });

    soundRef.current = sound;
    await sound.playAsync();
    setCurrentSoundId(soundId);
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setCurrentSoundId(null);
    }
  };

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
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`${isDark ? "text-white" : "text-black"} text-lg font-semibold`}
          >
            Ambient Sounds
          </Text>
          <Pressable onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </Pressable>
        </View>

        {ambientSounds.map((sound) => (
          <Pressable
            key={sound.id}
            className={`py-3 px-4 rounded-xl mb-3 flex-row items-center justify-between ${
              currentSoundId === sound.id
                ? isDark
                  ? "bg-white/10"
                  : "bg-black/10"
                : isDark
                  ? "bg-white/5"
                  : "bg-black/5"
            }`}
            onPress={() => {
              if (currentSoundId === sound.id) {
                stopSound();
              } else {
                playSound(sound.id);
              }
            }}
          >
            <Text className={`${isDark ? "text-white" : "text-black"}`}>
              {sound.name}
            </Text>
            <Ionicons
              name={currentSoundId === sound.id ? "pause" : "play"}
              size={20}
              color={isDark ? "white" : "black"}
            />
          </Pressable>
        ))}
      </View>
    </BlurView>
  );
}
