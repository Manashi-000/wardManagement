// app/another/settings.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setUser({ ...user, image: result.uri });
    }
  };

  const saveChanges = () => {
    alert("Profile updated (frontend only)!");
  };

  const logout = () => {
    alert("Logged out (frontend only).");
    router.replace("/tabs/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/home")}>
        <Ionicons name="arrow-back" size={28} color="#003083" />
      </TouchableOpacity>

      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <TouchableOpacity onPress={pickImage}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Card 1: Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Info</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person" size={20} color="#003083" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
          />
        </View>

        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#003083" style={styles.icon} />
          <TextInput
            style={[styles.input, { backgroundColor: "#E0E0E0" }]}
            placeholder="johndoe@example.com"
            value={user.email}
            editable={false}
          />
        </View>
      </View>

      {/* Card 2: Contact Info */}
      <View style={[styles.card, { backgroundColor: "#F0F8FF" }]}>
        <Text style={styles.cardTitle}>Contact Info</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="call" size={20} color="#003083" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="+977 9812345678"
            keyboardType="phone-pad"
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="location" size={20} color="#003083" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Kathmandu, Nepal"
            value={user.address}
            onChangeText={(text) => setUser({ ...user, address: text })}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#D9F0FF",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 6,
    elevation: 3,
  },
  imageWrapper: {
    marginBottom: 20,
    borderRadius: 80,
    overflow: "hidden",
    shadowColor: "#003083",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: { width: 160, height: 160, borderRadius: 80 },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#003083",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#003083",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003083",
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  saveBtn: {
    width: "90%",
    padding: 16,
    backgroundColor: "#003083",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#003083",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    width: "90%",
    padding: 16,
    backgroundColor: "#FF4D4D",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF4D4D",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
