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
console.log("this is backend url in complaint", API_URL)
export default function ComplaintScreen() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
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

      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const endpoint = `${API_URL}/complaints/create-complaints/`;
      console.log("📡 Sending to:", endpoint);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formDataa,
      });

      const data = await res.json();
      console.log("✅ Complaint response:", data);

      if (!res.ok) throw new Error(data.message || "Failed to submit");

      Alert.alert("✅ Success", "Complaint submitted successfully!");
      setSubject("");
      setDescription("");
      setLocation("");
      setCategory("");
      setImages([]);
    } catch (err) {
      console.log("❌ Upload error:", err.message);
      Alert.alert("❌ Error", "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-10">
      <View className="flex-row items-center mb-4">
        <Link href="/(tabs)/home">
          <Ionicons name="arrow-back" size={24} color="#003083" />
        </Link>
        <Text className="text-lg font-semibold ml-4 text-[#003083]">
          Lodge Complaint
        </Text>
      </View>

      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
        className="bg-gray-100 rounded-lg p-4 text-sm mb-4"
      />
      <TextInput
        placeholder="Describe your complaint"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        className="bg-gray-100 rounded-lg p-4 text-sm mb-4 text-[#111]"
      />
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
          onValueChange={setCategory}
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
        disabled={loading}
        className={`py-4 rounded-xl mb-8 ${loading ? "bg-gray-400" : "bg-[#003083]"
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
