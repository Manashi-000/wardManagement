import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
	const router = useRouter();

	useEffect(() => {
		const checkLogin = async () => {
			const token = await SecureStore.getItemAsync("userToken");
			setTimeout(() => {
				if (token) {
					router.replace("/(tabs)/home");  
				} else {
					//console.log("redirected from here")
					//router.replace("/login");  
					 router.replace("/(tabs)/home");      
				}
			}, 1500);
		};

		checkLogin();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Ward Management System 🚀</Text>
			<ActivityIndicator size="large" color="#003083" style={{ marginTop: 20 }} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
	title: { fontSize: 24, fontWeight: "bold", color: "#003083" },
});
