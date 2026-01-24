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
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const webClientId = process.env.GOOGLE_CLIENT_ID;
const iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;

const API_URL = "http://192.168.1.83:8000/api/v1/users"; 

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
		try {
			setLoading(true);

			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();

			const googleUser = {
				username: userInfo.user.name,
				email: userInfo.user.email,
				googleId: userInfo.user.id,
				image: userInfo.user.photo,
			};

			// TRY LOGIN
			const loginRes = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: googleUser.email,
					googleId: googleUser.googleId,
				}),
			});

			if (loginRes.ok) {
				const loginData = await loginRes.json();
				await AsyncStorage.setItem("token", loginData.token);
				router.replace("/(tabs)/home");
				return;
			}

			// IF USER NOT FOUND → SIGNUP
			const signupRes = await fetch(`${API_URL}/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(googleUser),
			});

			if (!signupRes.ok) {
				throw new Error("Signup failed");
			}

			const signupData = await signupRes.json();
			await AsyncStorage.setItem("token", signupData.data.token);
			router.replace("/(tabs)/home");

		} catch (error) {
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
			<Text style={styles.title}>Welcome 👋</Text>
			<Text style={styles.subtitle}>
				Sign in to continue
			</Text>

			{loading ? (
				<ActivityIndicator size="large" color="#4285F4" />
			) : (
				<GoogleSigninButton
					style={styles.googleBtn}
					size={GoogleSigninButton.Size.Wide}
					color={GoogleSigninButton.Color.Dark}
					onPress={signIn}
				/>
			)}
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		padding: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 8,
		color: "#0F172A",
	},
	subtitle: {
		fontSize: 16,
		color: "#64748B",
		marginBottom: 32,
	},
	googleBtn: {
		width: 230,
		height: 50,
	},
});

export default Login;
