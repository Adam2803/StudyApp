import { useTheme } from "@/components/theme-context";
import { useTaskStore } from "@/lib/task-store";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TaskDetailScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, editTask } = useTaskStore();
  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tag, setTag] = useState(task?.tag || "");

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Task not found</Text>
      </View>
    );
  }

  const saveTitle = (text: string) => {
    setTitle(text);
    editTask(task.id, { title: text });
  };

  const saveDescription = (text: string) => {
    setDescription(text);
    editTask(task.id, { description: text });
  };

  const saveTag = (text: string) => {
    setTag(text);
    editTask(task.id, { tag: text });
  };

  // ---- IMAGE PICKER ----
  const pickImage = async () => {
    if ((task.images || []).length >= 9) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (fileInfo.exists && "size" in fileInfo && fileInfo.size) {
        if (fileInfo.size > 3 * 1024 * 1024) {
          Alert.alert("File too large", "Max image size is 3MB.");
          return;
        }
      }

      const newImages = [...(task.images || []), asset.uri].slice(0, 9);
      editTask(task.id, { images: newImages });
    }
  };

  const deleteImage = (uri: string) => {
    const newImages = (task.images || []).filter((img) => img !== uri);
    editTask(task.id, { images: newImages });
  };

  // ---- PDF PICKER ----
  const pickFile = async () => {
    if ((task.files || []).length >= 6) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const { uri, name } = asset;

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && "size" in fileInfo && fileInfo.size) {
        if (fileInfo.size > 10 * 1024 * 1024) {
          Alert.alert("File too large", "Max PDF size is 10MB.");
          return;
        }
      }

      const newFiles = [...(task.files || []), { uri, name }].slice(0, 6);
      editTask(task.id, { files: newFiles });
    }
  };

  const deleteFile = (uri: string) => {
    const newFiles = (task.files || []).filter((f) => f.uri !== uri);
    editTask(task.id, { files: newFiles });
  };

  const openFile = async (uri: string) => {
    try {
      await WebBrowser.openBrowserAsync(uri);
    } catch (e) {
      Alert.alert("Error", "Unable to open file");
    }
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
        {/* Tag */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
            value={tag}
            onChangeText={saveTag}
            placeholder="Tag (e.g. personal)"
            style={{
              backgroundColor: isDark ? "#333" : "#eee",
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              color: isDark ? "#fff" : "#000",
              fontSize: 14,
              alignSelf: "flex-start",
              minWidth: "20%",
            }}
          />
        </View>

        {/* Title */}
        <View style={{ minHeight: 40, justifyContent: "center" }}>
          <TextInput
            value={title}
            onChangeText={saveTitle}
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingVertical: 4,
              color: isDark ? "#fff" : "#000",
            }}
            placeholder="Untitled Task"
          />
        </View>

        {/* Description */}
        <View style={{ minHeight: 40, marginTop: 16 }}>
          <TextInput
            value={description}
            onChangeText={saveDescription}
            multiline
            style={{
              fontSize: 16,
              paddingVertical: 4,
              color: isDark ? "#ddd" : "#333",
              textAlignVertical: "top",
            }}
            placeholder="No description"
          />
        </View>

        {/* PDF FILES */}
        <View style={{ marginTop: 20 }}>
          {(task.files || []).map((file, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                backgroundColor: isDark ? "#222" : "#f5f5f5",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Ionicons name="document-text" size={20} color="gray" />
              <TouchableOpacity
                onPress={() => openFile(file.uri)}
                style={{ flex: 1, marginLeft: 8 }}
              >
                <Text style={{ color: isDark ? "#fff" : "#000" }}>
                  {file.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteFile(file.uri)}>
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* IMAGES */}
        <FlatList
          data={task.images || []}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(uri, index) => uri + index}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                setPreviewIndex(index);
                setPreviewVisible(true);
              }}
              onLongPress={() => setShowDeleteIcons(true)}
              style={{ flex: 1 / 3, aspectRatio: 1, margin: 4 }}
            >
              <Image
                source={{ uri: item }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
              />
              {showDeleteIcons && (
                <Pressable
                  onPress={() => deleteImage(item)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 12,
                    padding: 2,
                  }}
                >
                  <Ionicons name="trash" size={16} color="red" />
                </Pressable>
              )}
            </Pressable>
          )}
          contentContainerStyle={{ marginTop: 16 }}
        />
      </ScrollView>

      {/* Upload Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          padding: 8,
          borderTopWidth: 1,
          borderColor: isDark ? "#333" : "#ddd",
          marginBottom: 12, // lift above home bar
        }}
      >
        {(task.files || []).length < 6 && (
          <TouchableOpacity onPress={pickFile}>
            <Ionicons name="document-attach" size={26} color="gray" />
          </TouchableOpacity>
        )}
        {(task.images || []).length < 9 && (
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image" size={26} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* Image Preview Modal */}
      <Modal visible={previewVisible} transparent={true}>
        <View className="flex-1 bg-black">
          <Image
            source={{ uri: (task.images || [])[previewIndex] }}
            style={{ flex: 1, resizeMode: "contain" }}
          />
          {/* Close */}
          <Pressable
            onPress={() => setPreviewVisible(false)}
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "rgba(128,128,128,0.5)",
              borderRadius: 20,
              padding: 6,
            }}
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          {/* Left arrow */}
          {previewIndex > 0 && (
            <Pressable
              onPress={() => setPreviewIndex((prev) => prev - 1)}
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                backgroundColor: "rgba(128,128,128,0.5)",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>
          )}
          {/* Right arrow */}
          {previewIndex < (task.images || []).length - 1 && (
            <Pressable
              onPress={() => setPreviewIndex((prev) => prev + 1)}
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                backgroundColor: "rgba(128,128,128,0.5)",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="chevron-forward" size={28} color="white" />
            </Pressable>
          )}
        </View>
      </Modal>
    </View>
  );
}
