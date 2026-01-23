import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from "../../components/slider";
import PostSlider from '../../components/postSlider';

export default function Home() {
  const router = useRouter();

  const quickAccess = [
    { label: 'Tax Detail', icon: 'credit-card', route: '/another/tax' },
    { label: 'Document Details', icon: 'file-text', route: '/another/documents' },
    { label: 'Member Detail', icon: 'user', route: '/another/member' },
    { label: 'Emergency Contact', icon: 'phone', route: '/another/emergency' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView 
        className="flex-1 bg-white p-4"
        contentContainerStyle={{ paddingBottom: 90}}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-xl font-bold" style={{ color: "#003083" }}>
            Mero Ward
          </Text>

          <TouchableOpacity onPress={() => router.push("/another/notice")}>
            <Feather name="bell" size={22} color="#003083" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f5f8ff",
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginBottom: 20,
          }}
        >
          <Feather name="search" size={18} color="#003083" />
          <TextInput
            style={{
              flex: 1,
              fontSize: 15,
              color: "#003083",
              marginLeft: 10,
            }}
            placeholder="Search anything..."
            placeholderTextColor="#777"
          />
          <TouchableOpacity
            onPress={() => router.push("/another/settings")}
            style={{
              height: 36,
              width: 36,
              borderRadius: 18,
              backgroundColor: "#003083",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="user" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Quick Access */}
        <Text className="text-lg font-semibold mb-4" style={{ color: "#003083" }}>
          Quick Access
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {quickAccess.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
              className="bg-white w-[48%] mb-4 p-4 rounded-xl border border-gray-200 flex-row items-center space-x-2 shadow-sm"
            >
              <Feather name={item.icon} size={18} color="#003083" />
              <Text className="text-sm font-medium ml-3">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6">
          <Slider />
        </View>

        <View className="mt-6">
          <PostSlider />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
