import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/components/theme-context";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const iconColor = isDark ? "white" : "black";

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        Alert.alert("Error", "Not logged in");
        router.replace("/auth/login");
        return;
      }

      setAuthUser(authData.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        Alert.alert("Profile Error", profileError.message);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Error", error.message);
    } else {
      router.replace("/auth/login");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black px-6">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-black dark:text-white">
          Loading user data...
        </Text>
      </View>
    );
  }

  if (!authUser || !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black px-6">
        <Text className="text-black dark:text-white">User not found.</Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 px-6 pt-12 pb-10 ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Ionicons name="arrow-back" size={28} color={iconColor} />
      </TouchableOpacity>

      {/* Avatar + Username */}
      <View className="items-center mb-10">
        <Ionicons name="person-circle-outline" size={180} color={iconColor} />
        <Text
          className={`mt-1 font-bold text-xl ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {profile.username ?? "USERNAME-PLACEHOLDER"}
        </Text>
      </View>

      {/* Info Section */}
      <View className="space-y-6 px-10">
        {/* Email */}
        <View className="flex-row items-center space-x-3 mb-6">
          <Ionicons name="mail-outline" size={26} color={iconColor} />
          <Text
            className={`text-base ml-3 ${isDark ? "text-white" : "text-black"}`}
          >
            {authUser.email}
          </Text>
        </View>

        {/* Level */}
        <View className="flex-row items-center space-x-3 mb-6">
          <Ionicons name="bar-chart-outline" size={26} color={iconColor} />
          <Text
            className={`text-base ml-3 ${isDark ? "text-white" : "text-black"}`}
          >
            Level - {profile.level}
          </Text>
        </View>

        {/* XP & Progress */}
        <View className="space-y-2 mb-2">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="flash-outline" size={26} color={iconColor} />
            <Text
              className={`text-base ml-3 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              XP
            </Text>
          </View>
          <View className="flex-row items-center space-x-3 mt-2">
            <Progress.Bar
              progress={profile.xp / 1000}
              width={220}
              height={10}
              color="limegreen"
              unfilledColor={isDark ? "#333" : "#ccc"}
              borderWidth={0}
              animated
            />
            <Text
              className={`text-xs ml-2 ${isDark ? "text-white" : "text-black"}`}
            >
              {profile.xp}xp
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mt-10 py-3 bg-red-600 rounded-full"
      >
        <Text className="text-white font-bold text-center text-base">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
