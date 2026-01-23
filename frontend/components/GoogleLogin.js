import React, { useState, useEffect } from 'react';
import { Button, View, Alert, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const googleClientId = Constants.expoConfig?.extra?.googleClient;
const API_URL = Constants.expoConfig?.extra?.backendURL;

export default function GoogleLogin() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId,
    extraParams: { access_type: "offline" },
    scopes: ["profile", "email"]
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      if (!id_token) {
        Alert.alert('Error', 'No ID token received from Google');
        return;
      }

      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (id_token) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token })
      });

      const data = await res.json();
      console.log("Backend:", data);

      if (res.ok) {
        // store jwt + user data
        await SecureStore.setItemAsync('userToken', data.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(data.user));

        Alert.alert("Login Successful! 🎉");

        // navigate to home page
        router.replace("/home");
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Continue with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 50
  }
});
