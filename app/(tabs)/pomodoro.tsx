import { supabase } from "@/lib/supabase";
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
  const [sessionCount, setSessionCount] = useState<number>(1);
  const [maxSessions, setMaxSessions] = useState<number>(2);

  const [pomoDuration, setPomoDuration] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft(pomoDuration * 60);
  }, [pomoDuration]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 16, marginRight: 16 }}>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const { data } = await supabase.auth.getSession();
              if (data.session) router.push("/auth/profile");
              else router.push("/auth/login");
            }}
          >
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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data, error } = await supabase
            .from("pomodoro_settings")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (!error && data) {
            setPomoDuration(data.pomo_duration);
            setBreakDuration(data.break_duration);
            setLongBreakDuration(data.long_break_duration);
            setMaxSessions(data.max_sessions);
            setSecondsLeft(data.pomo_duration * 60);
            setIsRunning(false);
            setIsBreakTime(false);
            setSessionCount(1);
          }
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const playSound = async (): Promise<void> => {
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

            const isLastSession = sessionCount === maxSessions;

            let nextTime = 0;
            let alertTitle = "";
            let alertMsg = "";

            if (isBreakTime) {
              // Was break, go to next pomodoro
              setIsBreakTime(false);
              nextTime = pomoDuration * 60;
              alertTitle = "Focus Time!";
              alertMsg = "Time to get back to work.";
              setSessionCount((prev) => (isLastSession ? 1 : prev + 1));
            } else {
              // Was work, go to break or long break
              const isLong = isLastSession;
              nextTime = isLong ? longBreakDuration * 60 : breakDuration * 60;
              alertTitle = isLong ? "Long Break!" : "Break Time!";
              alertMsg = isLong
                ? "Enjoy your long break."
                : "Take a short rest.";
              setIsBreakTime(true);
            }

            Alert.alert(alertTitle, alertMsg);
            return nextTime;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreakTime(false);
    setSessionCount(1);
    setSecondsLeft(pomoDuration * 60);
  };

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isBreakTime ? "Break" : "Focus"}</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <Text style={styles.label}>
        Session: {sessionCount} / {maxSessions}
      </Text>

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

            <Text>Long Break Duration (minutes):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={longBreakDuration.toString()}
              onChangeText={(val) => setLongBreakDuration(Number(val))}
            />

            <Text>Max Sessions:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={maxSessions.toString()}
              onChangeText={(val) => setMaxSessions(Number(val))}
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
    fontSize: 20,
    color: "white",
    marginBottom: 8,
  },
  timer: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
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
