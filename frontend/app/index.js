import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/tabs/home");
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Ward Management System 🚀
      </Text>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
