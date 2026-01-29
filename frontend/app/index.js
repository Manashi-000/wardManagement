import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
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
					router.replace("/login");
				}
			}, 2000); // smooth splash delay
		};

		checkLogin();
	}, []);

	return (
		<View style={styles.container}>
			{/* Logo */}
			<View style={styles.logoContainer}>
				<Image
					source={require("../assets/images/Logo.png")}
					style={styles.logo}
					resizeMode="contain"
				/>
			</View>

			{/* App Name */}
			<Text style={styles.appName}>
				Mero<Text style={styles.highlight}>Ward</Text>
			</Text>

			{/* Tagline */}
			<Text style={styles.tagline}>Empowering Local Communities</Text>

			{/* Loader */}
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" color="#0A3D91" />
				<Text style={styles.loadingText}>INITIALIZING SERVICES</Text>
			</View>

			{/* Footer */}
			<View style={styles.footer}>
				<Text style={styles.footerText}>
					Ward Governance Platform
				</Text>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d9e6ff",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
	},

	logoContainer: {
		backgroundColor: "#d9e6ff",
		padding: 22,
		borderRadius: 18,
		marginBottom: 18,
	},

	logo: {
		width: 64,
		height: 64,
	},

	appName: {
		fontSize: 30,
		fontWeight: "800",
		color: "#0A3D91",
		marginTop: 8,
	},

	highlight: {
		color: "#4F6F52",
	},

	tagline: {
		fontSize: 14,
		color: "#6B7280",
		marginTop: 6,
		letterSpacing: 0.3,
	},

	loaderContainer: {
		marginTop: 48,
		alignItems: "center",
	},

	loadingText: {
		marginTop: 12,
		fontSize: 12,
		color: "#94A3B8",
		letterSpacing: 1.2,
	},

	footer: {
		position: "absolute",
		bottom: 24,
	},

	footerText: {
		fontSize: 11,
		color: "#9CA3AF",
		letterSpacing: 0.4,
	},
});
