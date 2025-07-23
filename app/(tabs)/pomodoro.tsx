import SettingsModal from "@/components/SettingsModal";
import { useTheme } from "@/components/theme-context";
import TimerControls from "@/components/TimerControls";
import TimerDisplay from "@/components/TimerDisplay";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { router } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";

const alertSoundPath = require("@/assets/sounds/alert.mp3");

export default function PomodoroScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [maxSessions, setMaxSessions] = useState(2);

  const [pomoDuration, setPomoDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [initialDuration, setInitialDuration] = useState(25 * 60); // ✅ NEW

  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const newDuration = pomoDuration * 60;
    setSecondsLeft(newDuration);
    setInitialDuration(newDuration); // ✅ Update duration reference
  }, [pomoDuration]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row gap-4 mr-4">
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme === "dark" ? "white" : "black"}
            onPress={() => setShowSettings(true)}
          />
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={theme === "dark" ? "white" : "black"}
            onPress={async () => {
              const { data } = await supabase.auth.getSession();
              router.push(data.session ? "/auth/profile" : "/auth/login");
            }}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      },
      headerTintColor: theme === "dark" ? "#ffffff" : "#000000",
      title: "Pomodoro",
    });
  }, [navigation, theme]);

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
            const newDuration = data.pomo_duration * 60;
            setSecondsLeft(newDuration);
            setInitialDuration(newDuration); // ✅ Update
            setIsRunning(false);
            setIsBreakTime(false);
            setSessionCount(1);
          }
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

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

            const isLastSession = sessionCount === maxSessions;

            let nextTime = 0;
            let alertTitle = "";
            let alertMsg = "";

            if (isBreakTime) {
              setIsBreakTime(false);
              nextTime = pomoDuration * 60;
              setInitialDuration(nextTime); // ✅ Update
              alertTitle = "Focus Time!";
              alertMsg = "Time to get back to work.";
              setSessionCount((prev) => (isLastSession ? 1 : prev + 1));
            } else {
              const isLong = isLastSession;
              nextTime = (isLong ? longBreakDuration : breakDuration) * 60;
              setInitialDuration(nextTime); // ✅ Update
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
    const newDuration = pomoDuration * 60;
    setSecondsLeft(newDuration);
    setInitialDuration(newDuration); // ✅ Add this
  };

  return (
    <View
      className={`flex-1 justify-center items-center p-6 ${
        theme === "dark" ? "bg-card-dark" : "bg-gray-100"
      }`}
    >
      <TimerDisplay
        isBreakTime={isBreakTime}
        secondsLeft={secondsLeft}
        sessionCount={sessionCount}
        maxSessions={maxSessions}
        duration={initialDuration} // ✅ FIXED
      />

      <TimerControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        resetTimer={resetTimer}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={() => {
          setShowSettings(false);

          setTimeout(() => {
            const updatedDuration = isBreakTime
              ? breakDuration * 60
              : pomoDuration * 60;

            setInitialDuration(updatedDuration); // ✅ Make sure it's updated first
            setSecondsLeft(updatedDuration); // ✅ Then update secondsLeft
          }, 50); // small delay lets modal close before state update
        }}
        pomoDuration={pomoDuration}
        breakDuration={breakDuration}
        longBreakDuration={longBreakDuration}
        maxSessions={maxSessions}
        setPomoDuration={setPomoDuration}
        setBreakDuration={setBreakDuration}
        setLongBreakDuration={setLongBreakDuration}
        setMaxSessions={setMaxSessions}
      />
    </View>
  );
}
