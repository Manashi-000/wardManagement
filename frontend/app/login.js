import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Alert,
	Image,
} from "react-native";
import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const webClientId = process.env.GOOGLE_CLIENT_ID;
const iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;

const API_URL = process.env.BACKEND_URL;
const Login = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		GoogleSignin.configure({
			webClientId,
			iosClientId,
			offlineAccess: true,
			forceCodeForRefreshToken: true,
		});
	}, []);

	const signIn = async () => {
		console.log("Starting Google sign-in");
		try {
			setLoading(true);

			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			console.log("Google User Info:", userInfo.data.user);
			console.log("Google User Info Object:", userInfo);
			const googleUser = {
				username: userInfo.data.user.name,
				email: userInfo.data.user.email,
				googleId: userInfo.data.user.id,
				image: userInfo.data.user.photo,
			};
console.log(API_URL);
			const loginRes = await fetch(`${API_URL}/users/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: googleUser.email,
					googleId: googleUser.googleId,
				}),
			});
			console.log("Login response status:", loginRes.status);
			if (loginRes.ok) {
				await loginRes.json();
				router.replace("/(tabs)/home");
				return;
			}

			const signupRes = await fetch(`${API_URL}/users/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(googleUser),
			});
			console.log("Signup response status:", signupRes.status);
			if (!signupRes.ok) throw new Error("Signup failed");

			await signupRes.json();
			router.replace("/(tabs)/home");
		} catch (error) {
			console.log("Error during Google sign-in:", error);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				Alert.alert("Cancelled", "Google sign-in was cancelled");
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				Alert.alert("Error", "Google Play Services not available");
			} else {
				Alert.alert("Login Error", "Something went wrong. Try again.");
				console.error(error);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			{/* Logo */}
			<Image
				source={require("../assets/images/Logo.png")}
				style={styles.logo}
				resizeMode="contain"
			/>

			{/* Card */}
			<View style={styles.card}>
				<Text style={styles.welcome}>Welcome to</Text>
				<Text style={styles.appName}>MeroWard</Text>

				<Text style={styles.subtitle}>
					Manage wards efficiently and securely
				</Text>

				{loading ? (
					<ActivityIndicator size="large" color="#0A3D91" />
				) : (
					<View style={styles.googleWrapper}>
						<GoogleSigninButton
							size={GoogleSigninButton.Size.Wide}
							color={GoogleSigninButton.Color.Dark}
							onPress={signIn}
						/>
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d9e6ff",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},

	logo: {
		width: 90,
		height: 90,
		marginBottom: 20,
	},

	card: {
		width: "100%",
		maxWidth: 360,
		backgroundColor: "#EEF4FF",
		borderRadius: 20,
		padding: 24,
		alignItems: "center",
		shadowColor: "#64998B",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 8,
	},

	welcome: {
		fontSize: 14,
		color: "#64748B",
		marginBottom: 2,
	},

	appName: {
		fontSize: 22,
		fontWeight: "800",
		color: "#0A3D91",
		marginBottom: 10,
	},

	subtitle: {
		fontSize: 14,
		color: "#475569",
		textAlign: "center",
		marginBottom: 30,
	},

	googleWrapper: {
		transform: [{ scale: 1 }],
	},
});

export default Login;
