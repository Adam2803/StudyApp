import { MotiView } from "moti";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  resetTimer: () => void;
};

const AnimatedButton = ({
  label,
  onPress,
  disabled,
  color,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  color: string;
}) => {
  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "timing", duration: 400 }}
    >
      <TouchableOpacity
        className={`px-5 py-3 rounded-xl ${color}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text className="text-white font-bold text-lg">{label}</Text>
      </TouchableOpacity>
    </MotiView>
  );
};

export default function TimerControls({
  isRunning,
  setIsRunning,
  resetTimer,
}: Props) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      className="flex-row flex-wrap justify-center gap-3 mt-3"
    >
      <AnimatedButton
        label="Start"
        onPress={() => setIsRunning(true)}
        disabled={isRunning}
        color="bg-green-500"
      />
      <AnimatedButton
        label="Stop"
        onPress={() => setIsRunning(false)}
        disabled={!isRunning}
        color="bg-red-500"
      />
      <AnimatedButton
        label="Reset"
        onPress={resetTimer}
        color="bg-yellow-400"
      />
    </MotiView>
  );
}
