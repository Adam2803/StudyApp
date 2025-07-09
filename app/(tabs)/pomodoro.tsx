import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { router } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const alertSoundPath = require("@/assets/sounds/alert.mp3");

export default function PomodoroScreen() {
  const navigation = useNavigation();

  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);

  const [pomoDuration, setPomoDuration] = useState(25); // in minutes
  const [breakDuration, setBreakDuration] = useState(5); // in minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  const intervalRef = useRef<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Initial setup
  useEffect(() => {
    setSecondsLeft(pomoDuration * 60);
  }, [pomoDuration]);

  // Header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 16, marginRight: 16 }}>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Ionicons name="person-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: { backgroundColor: "#228B22" },
      headerTintColor: "white",
      title: "Pomodoro",
    });
  }, [navigation]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(alertSoundPath);
    await sound.playAsync();
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playSound();
            const nextIsBreak = !isBreakTime;
            setIsBreakTime(nextIsBreak);
            setSecondsLeft(
              nextIsBreak ? breakDuration * 60 : pomoDuration * 60
            );
            Alert.alert(
              nextIsBreak ? "Take a break!" : "Back to focus!",
              nextIsBreak ? "Relax a bit." : "Focus time again!"
            );
            return nextIsBreak ? breakDuration * 60 : pomoDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const resetTimer = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setIsBreakTime(false);
    setSecondsLeft(pomoDuration * 60);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {isBreakTime ? "Break Time" : "Focus Time"}
      </Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#34C759" }]}
          onPress={() => setIsRunning(true)}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30" }]}
          onPress={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFD60A" }]}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Settings modal */}
      <Modal visible={showSettings} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Settings</Text>

            <Text>Pomodoro Duration (minutes):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={pomoDuration.toString()}
              onChangeText={(val) => setPomoDuration(Number(val))}
            />

            <Text>Break Duration (minutes):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={breakDuration.toString()}
              onChangeText={(val) => setBreakDuration(Number(val))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#0A84FF" }]}
                onPress={() => {
                  setSecondsLeft(
                    isBreakTime ? breakDuration * 60 : pomoDuration * 60
                  );
                  setShowSettings(false);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#999" }]}
                onPress={() => setShowSettings(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#228B22",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  label: {
    fontSize: 24,
    color: "white",
    marginBottom: 8,
  },
  timer: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
});
