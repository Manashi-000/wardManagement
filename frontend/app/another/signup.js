// app/signup.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (!username || !email || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      // Example request to backend
      const res = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        Alert.alert("Signup Successful", `Account created for ${user.username}`);
        router.push("/login"); // Go to login page after signup
      } else {
        Alert.alert("Signup Failed", "Please try again");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-8" style={{ color: "#003083" }}>
        Sign Up
      </Text>

      {/* Username */}
      <TextInput
        className="w-full p-3 mb-4 rounded-lg border"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderColor: "#4F6F52", borderWidth: 1 }}
      />

      {/* Email */}
      <TextInput
        className="w-full p-3 mb-4 rounded-lg border"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderColor: "#4F6F52", borderWidth: 1 }}
      />

      {/* Password */}
      <TextInput
        className="w-full p-3 mb-6 rounded-lg border"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderColor: "#4F6F52", borderWidth: 1 }}
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        onPress={handleSignup}
        className="w-full p-3 rounded-lg"
        style={{ backgroundColor: "#003083" }}
      >
        <Text className="text-center text-white font-semibold text-lg">Sign Up</Text>
      </TouchableOpacity>

      {/* Login Redirect */}
      <View className="flex-row justify-center mt-4">
        <Text style={{ color: "#4F6F52" }}>Already have an account?{" "}</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={{ color: "#003083", textDecorationLine: "underline" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

