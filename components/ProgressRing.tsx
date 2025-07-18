import React from "react";
import { View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Props = {
  duration: number; // total time in seconds
  remaining: number; // remaining time in seconds
};

export default function ProgressRing({ duration, remaining }: Props) {
  const fill = (remaining / duration) * 100;

  return (
    <View className="items-center justify-center">
      <AnimatedCircularProgress
        size={220}
        width={12}
        fill={fill}
        tintColor="#10b981" // emerald-500
        backgroundColor="#1f2937" // gray-800
        rotation={0}
        lineCap="round"
        duration={300}
      >
        {() => null}
      </AnimatedCircularProgress>
    </View>
  );
}
