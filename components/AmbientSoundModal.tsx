import React, { useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./theme-context"; // ✅ using your custom hook

interface AmbientSoundModalProps {
  visible: boolean;
  onClose: () => void;
}

const sounds = [
  {
    name: "Brown Noise",
    file: require("@/assets/sounds/Music/brown-noise-by-digitalspa-170337.mp3"),
  },
  {
    name: "Calming Rain",
    file: require("@/assets/sounds/Music/calming-rain-257596.mp3"),
  },
];

export default function AmbientSoundModal({
  visible,
  onClose,
}: AmbientSoundModalProps) {
  const { theme } = useTheme(); // ✅ from your theme-context
  const isDark = theme === "dark";

  const [currentSoundIndex, setCurrentSoundIndex] = useState<number | null>(
    null
  );
  const soundRef = useRef<Audio.Sound | null>(null);

  const playSound = async (index: number) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const { sound } = await Audio.Sound.createAsync(sounds[index].file, {
      isLooping: true,
      volume: 0.8,
    });

    soundRef.current = sound;
    await sound.playAsync();
    setCurrentSoundIndex(index);
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setCurrentSoundIndex(null);
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

        {sounds.map((sound, i) => (
          <Pressable
            key={i}
            className={`py-3 px-4 rounded-xl mb-3 flex-row items-center justify-between ${
              currentSoundIndex === i
                ? isDark
                  ? "bg-white/10"
                  : "bg-black/10"
                : isDark
                  ? "bg-white/5"
                  : "bg-black/5"
            }`}
            onPress={() => {
              if (currentSoundIndex === i) {
                stopSound();
              } else {
                playSound(i);
              }
            }}
          >
            <Text className={`${isDark ? "text-white" : "text-black"}`}>
              {sound.name}
            </Text>
            <Ionicons
              name={currentSoundIndex === i ? "pause" : "play"}
              size={20}
              color={isDark ? "white" : "black"}
            />
          </Pressable>
        ))}
      </View>
    </BlurView>
  );
}
