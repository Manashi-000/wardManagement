import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Example: check if user exists from API (fake check for now)
      if (!username ||!password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      // Example request to backend
      // Replace URL with your Express/Prisma API
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username,password }),
      });

      if (res.ok) {
        const user = await res.json();
        if (user?.id) {
          Alert.alert("Login Successful", `Welcome ${user.username}`);
          router.push("/tabs/home"); // ✅ go to homepage if login works
        } else {
          router.push("/signup"); // ✅ no id → go to signup
        }
      } else {
        router.push("/signup"); // if login fails → signup
      }
    } catch (error) {
      console.error(error);
      router.push("/signup");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-8" style={{ color: "#003083" }}>
        Login
      </Text>

      {/* Username */}
      <TextInput
        className="w-full p-3 mb-4 rounded-lg border"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
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

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        className="w-full p-3 rounded-lg"
        style={{ backgroundColor: "#003083" }}
      >
        <Text className="text-center text-white font-semibold text-lg">Login</Text>
      </TouchableOpacity>

      {/* Signup Redirect */}
          <View className="flex-row justify-center mt-4">
      <Text style={{ color: "#4F6F52" }}>
        Don’t have an account?{" "}
      </Text>
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text
          style={{
            color: "#003083",
            textDecorationLine: "underline",
          }}
        >
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}
