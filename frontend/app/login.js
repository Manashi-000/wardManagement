import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';

import Constants from "expo-constants"

const webClientId = Constants.expoConfig.extra.BACKEND_URL
const androidClientId = Constants.expoConfig.extra.ANDROID_CLIENT_ID;
const iosClientId = Constants.expoConfig.extra.IOS_CLIENT_ID;


const Login = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
      // androidClientId: androidClientId,
      iosClientId: iosClientId,
      profileImageSize: 150,
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
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Some other error happened:', error);
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
}