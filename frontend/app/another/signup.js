import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle Google Sign Up
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Signup Successful", "Welcome with Google!");
        router.push("/tabs/home");
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert("Signup Failed", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={26} color="#003083" />
      </TouchableOpacity>

      {/* Centered Card */}
      <View style={styles.centeredContainer}>
        <View style={styles.card}>
          {/* Illustration */}
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            }}
            style={styles.userIllustration}
            resizeMode="contain"
          />

          {/* Title / Subtitle */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {/* Google Sign Up Button */}
          <TouchableOpacity
            style={[styles.googleButton, loading && { opacity: 0.6 }]}
            onPress={handleGoogleSignup}
            disabled={loading}
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              }}
              style={styles.googleLogo}
            />
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.googleButtonText}>Sign Up with Google</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Redirect to Login */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/another/login")}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#74BFF5", // light blue background
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  centeredContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#E0F2FE",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    width: "100%",
    alignItems: "center",
  },
  userIllustration: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003083",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4F6F52",
    textAlign: "center",
    marginBottom: 25,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    color: "#555",
    fontWeight: "500",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#4F6F52",
    fontSize: 14,
  },
  signupLink: {
    color: "#003083",
    textDecorationLine: "underline",
    fontSize: 14,
    marginLeft: 5,
  },
});
