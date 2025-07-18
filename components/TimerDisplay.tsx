import { useTheme } from "@/components/theme-context"; // ✅ use your custom theme context
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
type Props = {
  isBreakTime: boolean;
  secondsLeft: number;
  sessionCount: number;
  maxSessions: number;
  duration: number; // in seconds
};

export default function TimerDisplay({
  isBreakTime,
  secondsLeft,
  sessionCount,
  maxSessions,
  duration,
}: Props) {
  const progressRef = useRef<AnimatedCircularProgress>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const fillPercent = duration > 0 ? (secondsLeft / duration) * 100 : 0;

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.animate(fillPercent, 300);
    }
  }, [secondsLeft, duration]);

  return (
    <View className="items-center justify-center mb-6">
      <AnimatedCircularProgress
        ref={progressRef}
        size={250}
        width={15}
        backgroundWidth={15}
        fill={fillPercent}
        tintColor={isDark ? "#ffffff" : "#000000"} // ✅ white for dark, black for light
        backgroundColor={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} // ✅ subtle background
        lineCap="round"
        rotation={0}
        duration={300}
      >
        {() => (
          <Text
            className={`font-bold text-7xl font-mono ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {minutes}:{seconds}
          </Text>
        )}
      </AnimatedCircularProgress>

      <Text
        className={`text-base font-bold mt-4 opacity-80 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {isBreakTime ? "Break" : "Focus"} — Session {sessionCount}/{maxSessions}
      </Text>
    </View>
  );
}
