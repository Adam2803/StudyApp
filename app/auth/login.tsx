import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }

    const user = data?.user;
    if (!user) {
      Alert.alert("Login Failed", "No user returned from Supabase.");
      return;
    }

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      const pendingUsername = await SecureStore.getItemAsync(
        "pending_username"
      );
      const finalUsername = pendingUsername?.trim() || "unknown";

      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          username: finalUsername,
          xp: 0,
          level: 1,
        },
      ]);

      // Clear stored username after use
      await SecureStore.deleteItemAsync("pending_username");

      if (insertError) {
        Alert.alert("Profile Error", insertError.message);
        return;
      }
    }

    router.replace("/auth/profile");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

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
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        maxLength={100}
      />

      <Button title="Log In" onPress={handleLogin} />

      <Text style={styles.link} onPress={() => router.replace("/auth/signup")}>
        Don't have an account? Sign up
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
