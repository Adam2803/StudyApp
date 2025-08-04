import { useTheme } from "@/components/theme-context";
import { useTaskStore } from "@/lib/task-store";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const { tasks, editTask } = useTaskStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const task = tasks.find((t) => t.id === id);

  const [editingField, setEditingField] = useState<
    "title" | "description" | "tag" | null
  >(null);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tag, setTag] = useState(task?.tag || "personal");
  const [imageUri, setImageUri] = useState<string | null>(
    task?.imageUri || null
  );
  const [isImageSelected, setIsImageSelected] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setTag(task.tag || "personal");
      setImageUri(task.imageUri || null);
    }
  }, [task?.id]);

  useEffect(() => {
    if (!task) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      editTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        tag: tag.trim() || "personal",
        imageUri: imageUri,
      });
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [title, description, tag, imageUri]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
    }
  };

  const deleteImage = async () => {
    if (!imageUri) return;

    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(imageUri, { idempotent: true });

            setImageUri(null);
            setIsImageSelected(false);
          } catch (error) {
            Alert.alert("Delete Error", "Failed to delete image.");
            console.error("Image delete error:", error);
          }
        },
      },
    ]);
  };

  const onImageLongPress = (event: { nativeEvent: { state: any } }) => {
    if (event.nativeEvent.state === State.BEGAN) {
      Vibration.vibrate(50);
      setIsImageSelected(true);
    }
  };

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-lg text-gray-400">Task not found.</Text>
      </View>
    );
  }

  const placeholderColor = isDark ? "#d1d5db" : "#9ca3af";
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsImageSelected(false);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        >
          {/* Tag */}
          {editingField === "tag" ? (
            <TextInput
              value={tag}
              onChangeText={setTag}
              autoFocus
              onBlur={() => setEditingField(null)}
              className={`text-md mb-2 ${textColor}`}
              placeholder="Tag (e.g. personal)"
              placeholderTextColor={placeholderColor}
              style={{ padding: 0, margin: 0, lineHeight: 20 }}
            />
          ) : (
            <View
              className={`rounded-full self-start px-3 py-1 mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <Text
                className={`text-md font-semibold ${textColor}`}
                onPress={() => setEditingField("tag")}
              >
                {tag || "Tag (e.g. personal)"}
              </Text>
            </View>
          )}

          {/* Title */}
          {editingField === "title" ? (
            <TextInput
              value={title}
              onChangeText={setTitle}
              autoFocus
              onBlur={() => setEditingField(null)}
              className={`text-2xl font-bold mb-2 ${textColor}`}
              placeholder="What would you like to do?"
              placeholderTextColor={placeholderColor}
              style={{ padding: 0, margin: 0, lineHeight: 32 }}
            />
          ) : (
            <Text
              className={`text-2xl font-bold mb-2 ${title ? textColor : "text-gray-400"}`}
              style={{ lineHeight: 32 }}
              onPress={() => setEditingField("title")}
            >
              {title || "What would you like to do?"}
            </Text>
          )}

          {/* Description */}
          {editingField === "description" ? (
            <TextInput
              value={description}
              onChangeText={setDescription}
              autoFocus
              multiline
              onBlur={() => setEditingField(null)}
              className={`text-base mt-2 ${textColor}`}
              placeholder="Description"
              placeholderTextColor={placeholderColor}
              style={{ padding: 0, margin: 0, lineHeight: 24 }}
            />
          ) : (
            <Text
              className={`text-base mt-2 ${description ? textColor : "text-gray-400"}`}
              style={{ lineHeight: 24 }}
              onPress={() => setEditingField("description")}
            >
              {description || "Description"}
            </Text>
          )}

          {/* Display the image below the description */}
          {imageUri && (
            <LongPressGestureHandler
              onHandlerStateChange={onImageLongPress}
              minDurationMs={800}
            >
              <View className="relative">
                <Image
                  source={{ uri: imageUri }}
                  className="w-full aspect-video rounded-lg mt-4"
                  resizeMode="cover"
                />
                {isImageSelected && (
                  <Animated.View
                    entering={ZoomIn}
                    exiting={ZoomOut}
                    className="absolute top-6 right-2 w-8 h-8 rounded-full items-center justify-center bg-red-500"
                  >
                    <TouchableOpacity onPress={deleteImage}>
                      <Ionicons name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </LongPressGestureHandler>
          )}
        </ScrollView>

        {/* Fixed bottom view for adding a new image */}
        <SafeAreaView
          edges={["bottom"]}
          className={`flex-row justify-around p-4 pb-6 border-t ${isDark ? "bg-black border-gray-700" : "bg-white border-gray-200"}`}
        >
          <TouchableOpacity onPress={pickImage} className="items-center">
            <Ionicons
              name="image-outline"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
