import React from "react";
import { MotiView, AnimatePresence } from "moti";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  resetTimer: () => void;
  onOpenMusicPlayer: () => void;
  isMusicPlaying?: boolean;
  isMusicLoading?: boolean;
};

const AnimatedIconButton = ({
  onPress,
  disabled,
  color,
  iconName,
  size = 32,
  iconColor = "white",
}: {
  onPress: () => void;
  disabled?: boolean;
  color: string;
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  iconColor?: string;
}) => {
  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "timing", duration: 400 }}
    >
      <TouchableOpacity
        className={`w-16 h-16 rounded-full items-center justify-center ${color}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Ionicons name={iconName} size={size} color={iconColor} />
      </TouchableOpacity>
    </MotiView>
  );
};

export default function TimerControls({
  isRunning,
  setIsRunning,
  resetTimer,
  onOpenMusicPlayer,
  isMusicPlaying,
  isMusicLoading,
}: Props) {
  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    resetTimer();
    setIsRunning(false);
  };

  const playPauseIcon = isRunning ? "pause-outline" : "play-outline";
  const playPauseColor = isRunning ? "bg-red-500" : "bg-green-500";

  const musicIcon = isMusicPlaying
    ? "volume-mute-outline"
    : "musical-notes-outline";
  const musicColor = "bg-blue-500";

  return (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="flex-row flex-wrap justify-center gap-4 mt-6"
    >
      {isRunning ? (
        <AnimatePresence>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "timing",
              duration: 300,
            }}
            className="flex-row gap-4"
          >
            {/* Left: Reset */}
            <AnimatedIconButton
              iconName="reload-outline"
              onPress={handleReset}
              color="bg-yellow-400"
            />

            {/* Middle: Pause */}
            <AnimatedIconButton
              iconName={playPauseIcon}
              onPress={handleToggleTimer}
              color={playPauseColor}
            />

            {/* Right: Music */}
            <AnimatedIconButton
              iconName={musicIcon}
              onPress={onOpenMusicPlayer}
              color={musicColor}
              disabled={isMusicLoading}
            />
          </MotiView>
        </AnimatePresence>
      ) : (
        // If not running, only show Play button
        <AnimatedIconButton
          iconName={playPauseIcon}
          onPress={handleToggleTimer}
          color={playPauseColor}
        />
      )}
    </MotiView>
  );
}
