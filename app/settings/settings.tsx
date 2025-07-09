import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const [pomodoroTime, setPomodoroTime] = useState("25");
  const [breakTime, setBreakTime] = useState("5");

  useEffect(() => {
    const loadTimes = async () => {
      const storedPomodoro = await AsyncStorage.getItem("pomodoroTime");
      const storedBreak = await AsyncStorage.getItem("breakTime");

      if (storedPomodoro) setPomodoroTime(storedPomodoro);
      if (storedBreak) setBreakTime(storedBreak);
    };

    loadTimes();
  }, []);

  const handleSave = async () => {
    if (!pomodoroTime || !breakTime) {
      Alert.alert("Error", "Please enter valid durations.");
      return;
    }

    await AsyncStorage.setItem("pomodoroTime", pomodoroTime);
    await AsyncStorage.setItem("breakTime", breakTime);

    Alert.alert("Saved", "Your settings have been saved.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Settings</Text>

      <Text style={styles.label}>Pomodoro Duration (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={pomodoroTime}
        onChangeText={setPomodoroTime}
      />

      <Text style={styles.label}>Break Duration (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={breakTime}
        onChangeText={setBreakTime}
      />

      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
});
