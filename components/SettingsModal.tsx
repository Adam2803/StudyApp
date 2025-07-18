import { useTheme } from "@/components/theme-context"; // ✅ import your theme context
import { AnimatePresence, MotiView } from "moti";
import {
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  pomoDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  maxSessions: number;
  setPomoDuration: (val: number) => void;
  setBreakDuration: (val: number) => void;
  setLongBreakDuration: (val: number) => void;
  setMaxSessions: (val: number) => void;
};

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
}: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <AnimatePresence>
        {visible && (
          <View className="flex-1 justify-center items-center bg-black/40 p-5">
            <MotiView
              from={{ opacity: 0, translateY: 40 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 40 }}
              transition={{ type: "timing", duration: 300 }}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl w-full"
            >
              <Text className="text-lg font-bold text-black dark:text-white mb-3">
                Timer Settings
              </Text>

              {/* Inputs */}
              <Text className="text-black dark:text-white">
                Pomodoro Duration (minutes):
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-md p-2 mb-3"
                keyboardType="numeric"
                value={pomoDuration.toString()}
                onChangeText={(val) => setPomoDuration(Number(val))}
              />

              <Text className="text-black dark:text-white">
                Break Duration (minutes):
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-md p-2 mb-3"
                keyboardType="numeric"
                value={breakDuration.toString()}
                onChangeText={(val) => setBreakDuration(Number(val))}
              />

              <Text className="text-black dark:text-white">
                Long Break Duration (minutes):
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-md p-2 mb-3"
                keyboardType="numeric"
                value={longBreakDuration.toString()}
                onChangeText={(val) => setLongBreakDuration(Number(val))}
              />

              <Text className="text-black dark:text-white">Max Sessions:</Text>
              <TextInput
                className="border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-md p-2 mb-3"
                keyboardType="numeric"
                value={maxSessions.toString()}
                onChangeText={(val) => setMaxSessions(Number(val))}
              />

              {/* ✅ Theme Toggle */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base text-black dark:text-white">
                  Dark Mode
                </Text>
                <Switch value={theme === "dark"} onValueChange={toggleTheme} />
              </View>

              <View className="flex-row justify-end gap-3">
                <TouchableOpacity
                  className="bg-blue-500 px-4 py-3 rounded-xl"
                  onPress={onSave}
                >
                  <Text className="text-white font-bold">Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-500 px-4 py-3 rounded-xl"
                  onPress={onClose}
                >
                  <Text className="text-white font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
}
