import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { router } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreakTime, setIsBreakTime] = useState<boolean>(false);
  const [session, setSession] = useState<number>(1);

  const [pomoDuration, setPomoDuration] = useState<number>(25);
  const [shortBreak, setShortBreak] = useState<number>(5);
  const [longBreak, setLongBreak] = useState<number>(15);
  const [maxSession, setMaxSession] = useState<number>(2);

  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const intervalRef = useRef<number | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

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

  useEffect(() => {
    setSecondsLeft(pomoDuration * 60);
  }, [pomoDuration]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(alertSoundPath);
    await sound.playAsync();
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);
            playSound();

            let nextIsBreak = !isBreakTime;
            let nextSession = session;

            if (!isBreakTime) {
              nextSession = session + 1;
              setSession(nextSession);
            }

            const isLongBreak = nextSession > maxSession;

            if (isLongBreak) {
              Alert.alert("Long Break!", "You earned it.");
              setSession(1);
              setIsBreakTime(true);
              setSecondsLeft(longBreak * 60);
            } else {
              setIsBreakTime(nextIsBreak);
              setSecondsLeft(nextIsBreak ? shortBreak * 60 : pomoDuration * 60);
              Alert.alert(
                nextIsBreak ? "Break Time" : "Back to Work!",
                nextIsBreak ? "Time to relax." : "Let's get focused again!"
              );
            }

            return isLongBreak
              ? longBreak * 60
              : nextIsBreak
              ? shortBreak * 60
              : pomoDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreakTime(false);
    setSession(1);
    setSecondsLeft(pomoDuration * 60);
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {isBreakTime
          ? session > maxSession
            ? "Long Break"
            : "Short Break"
          : "Focus Time"}
      </Text>
      <Text style={styles.session}>
        Session {session} of {maxSession}
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

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Settings</Text>

            <Text>Pomodoro (min):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={pomoDuration.toString()}
              onChangeText={(val) => setPomoDuration(Number(val))}
            />

            <Text>Short Break (min):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={shortBreak.toString()}
              onChangeText={(val) => setShortBreak(Number(val))}
            />

            <Text>Long Break (min):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={longBreak.toString()}
              onChangeText={(val) => setLongBreak(Number(val))}
            />

            <Text>Total Sessions:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={maxSession.toString()}
              onChangeText={(val) => setMaxSession(Number(val))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#0A84FF" }]}
                onPress={() => {
                  setSecondsLeft(
                    isBreakTime
                      ? session > maxSession
                        ? longBreak * 60
                        : shortBreak * 60
                      : pomoDuration * 60
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

// ✅ StyleSheet not converted to TSX as requested
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
    marginBottom: 6,
  },
  session: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
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
