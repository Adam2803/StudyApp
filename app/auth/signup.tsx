import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = async () => {
    if (!username.trim()) {
      Alert.alert("Missing Username", "Please enter a username.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign Up Failed", error.message);
      return;
    }

    // Save username locally for use after confirmation
    await SecureStore.setItemAsync("pending_username", username.trim());

    Alert.alert("Success", "Check your email to confirm your account.");
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        maxLength={100}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        maxLength={100}
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 6 chars)"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        maxLength={100}
      />

      <Button title="Sign Up" onPress={handleSignUp} />

      <Text style={styles.link} onPress={() => router.replace("/auth/login")}>
        Already have an account? Log in
      </Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#007AFF",
  },
});
