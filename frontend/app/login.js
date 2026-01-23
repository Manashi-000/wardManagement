import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const androidClientId = Constants.expoConfig.extra.googleAndroidClientId;
  console.log("androidClient: ",androidClientId)

 
const [request, response, promptAsync] = Google.useAuthRequest({
    
    androidClientId: `${androidClientId}`,
    
        
    scopes: ["profile", "email"],
  }, { 
    useProxy: true 
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Google Auth Response:", response); 
      handleGoogleLogin(response.authentication.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${Constants.expoConfig.extra.backendURL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        await SecureStore.setItemAsync("userToken", data.token);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", data.message || "Unable to login");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Login Failed", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
          }}
          style={styles.userIllustration}
        />

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Welcome to MeroWard</Text>

        <TouchableOpacity
          disabled={!request || loading}
          onPress={() => promptAsync()}
          style={[styles.googleButton, loading && { opacity: 0.6 }]}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
            }}
            style={styles.googleLogo}
          />
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.googleButtonText}>
              Continue with Google
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "90%",
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
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003083",
    padding: 14,
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
});
