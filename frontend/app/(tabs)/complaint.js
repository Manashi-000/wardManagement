import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;

export default function ComplaintScreen() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets?.map((a) => a.uri) || [];
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const handleSubmit = async () => {
    if (!subject || !description || !location || !category) {
      Alert.alert("⚠️ Missing Info", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("taggedLocation", location);
      formData.append("category", category);

      images.forEach((uri) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("images", { uri, name: filename, type });
      });

      const res = await fetch(`${API_URL}/complaints/create-complaints/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Alert.alert("✅ Success", "Complaint submitted successfully!");
      setSubject("");
      setDescription("");
      setLocation("");
      setCategory("");
      setImages([]);
    } catch (err) {
      Alert.alert("❌ Error", err.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-10">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Link href="/(tabs)/home">
          <View className="w-10 h-10 rounded-full bg-[#003083] items-center justify-center">
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </View>
        </Link>

        <Text className="text-2xl font-bold ml-4 text-[#003083]">
          Lodge Complaint
        </Text>
      </View>

      {/* Subject */}
      <TextInput
        placeholder="Organization"
        value={subject}
        onChangeText={setSubject}
        className="bg-gray-100 rounded-xl p-4 text-sm mb-4"
      />

      {/* Description */}
      <TextInput
        placeholder="Describe your complaint"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="bg-gray-100 rounded-xl p-4 text-sm mb-6 text-[#111]"
      />

      {/* Image Upload */}
      <Text className="text-lg font-semibold mb-3 text-[#003083]">
        Add Media
      </Text>

      <View className="border-2 border-dashed border-[#4F6F52] rounded-xl p-14 mb-8">
        {images.length > 0 && (
          <View className="flex-row flex-wrap mb-5">
            {images.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  margin: 6,
                }}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={pickImage}
          className="bg-[#e6f0ff] py-3 rounded-lg"
        >
          <Text className="text-center text-[#003083] font-semibold">
            Upload Photos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category */}
      <Text className="text-base font-semibold mb-2 text-[#003083]">
        Category
      </Text>
      <View className="bg-gray-100 rounded-lg mb-8">
        <RNPickerSelect
          onValueChange={setCategory}
          value={category}
          placeholder={{ label: "Select Category", value: "" }}
          items={[
            { label: "Road", value: "ROAD" },
            { label: "Water", value: "WATER" },
            { label: "Electricity", value: "ELECTRICITY" },
            { label: "Education", value: "EDUCATION" },
            { label: "Health", value: "HEALTH" },
            { label: "Other", value: "OTHER" },
          ]}
          style={{
            inputIOS: { padding: 16, fontSize: 14, color: "#111" },
            inputAndroid: { padding: 16, fontSize: 14, color: "#111" },
          }}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className={`py-4 rounded-xl mb-8 ${
          loading ? "bg-gray-400" : "bg-[#003083]"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-white font-semibold text-base">
            Submit Complaint
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
