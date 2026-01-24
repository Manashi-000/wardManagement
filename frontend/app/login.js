import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

const webClientId = process.env.GOOGLE_CLIENT_ID;
const iosClientId = process.env.GOOGLE_IOS_CLIENT_ID;

console.log("this is secret:", webClientId, iosClientId);

const Login = () => {
	useEffect(() => {
		GoogleSignin.configure({
			webClientId: webClientId,
			iosClientId: iosClientId,
			// profileImageSize: 150,
			offlineAccess: true,
			forceCodeForRefreshToken: true,
		});
	}, []);

	const signIn = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			console.log(userInfo);
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log("User cancelled the login flow");
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log("Sign in is in progress already");
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log("Play services not available or outdated");
			} else {
				console.error("Some other error happened:", error);
			}
		}
	};

	return (
		<GoogleSigninButton
			style={{ width: 192, height: 48 }}
			size={GoogleSigninButton.Size.Wide}
			color={GoogleSigninButton.Color.Dark}
			onPress={signIn}
		/>
	);
};

export default Login;
