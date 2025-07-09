import { router } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ConfirmedScreen() {
  useEffect(() => {
    // Optional: auto-redirect to login after a delay
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Email Confirmed</Text>
      <Text style={styles.message}>
        Your account is now verified. You can log in!
      </Text>
      <Button
        title="Go to Login"
        onPress={() => router.replace("/auth/login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
