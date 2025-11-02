import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";

export default function ComplaintScreen() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  const API_BASE = "http://192.168.1.100:8000/api/v1/complaints";

  // 📸 Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((a) => a.uri)]);
    }
  };

  // 📤 Submit Complaint
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("taggedLocation", location);
      formData.append("category", category);

      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      await axios.post(`${API_BASE}/create-complaints/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("✅ Success", "Complaint submitted");
      setSubject("");
      setDescription("");
      setLocation("");
      setCategory("");
      setImages([]);
    } catch (err) {
      console.log("Upload error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to submit complaint");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-10">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Link href="/(tabs)/home">
          <Ionicons name="arrow-back" size={24} color="#003083" />
        </Link>
        <Text className="text-lg font-semibold ml-4 text-[#003083]">
          Lodge Complaint
        </Text>
      </View>

      {/* Subject */}
      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
        className="bg-gray-100 rounded-lg p-4 text-sm mb-4"
      />

      {/* Description */}
      <TextInput
        placeholder="Describe your complaint"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        className="bg-gray-100 rounded-lg p-4 text-sm mb-4 text-[#111]"
      />

      {/* Upload Images */}
      <Text className="text-base font-semibold mb-2 text-[#003083]">
        Add Media
      </Text>
      <View className="border-2 border-dashed border-[#4F6F52] rounded-lg p-6 items-center justify-center mb-6">
        {images.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {images.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={{ width: 80, height: 80, borderRadius: 8, margin: 5 }}
              />
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-100 rounded-md px-4 py-2"
        >
          <Text className="text-[#4F6F52] font-medium">Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <Text className="text-base font-semibold mb-2 text-[#003083]">
        Location
      </Text>
      <TextInput
        placeholder="Tag Location"
        value={location}
        onChangeText={setLocation}
        className="bg-gray-100 rounded-lg p-4 text-sm mb-6"
      />

      {/* Category */}
      <Text className="text-base font-semibold mb-2 text-[#003083]">
        Category
      </Text>
      <View className="bg-gray-100 rounded-lg mb-8">
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: "Road", value: "ROAD" },
            { label: "Water", value: "WATER" },
            { label: "Electricity", value: "ELECTRICITY" },
            { label: "Education", value: "EDUCATION" },
            { label: "Health", value: "HEALTH" },
            { label: "Other", value: "OTHER" },
          ]}
          value={category}
          placeholder={{ label: "Select Category", value: "" }}
          style={{
            inputIOS: { padding: 16, fontSize: 14, color: "#111" },
            inputAndroid: { padding: 16, fontSize: 14, color: "#111" },
            placeholder: { color: "#999" },
          }}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-[#003083] py-4 rounded-xl mb-8"
      >
        <Text className="text-center text-white font-semibold text-base">
          Submit Complaint
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
