// app/tabs/home.js
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from "../../components/slider";

export default function Home() {
  const router = useRouter();

  const quickAccess = [
    { label: 'Notices', icon: 'flag', route: '/another/notice' },
    { label: 'Document Details', icon: 'file-text', route: '/another/documents' },
    { label: 'Member Detail', icon: 'user', route: '/another/member' },
    { label: 'Emergency Contact', icon: 'phone', route: '/another/emergency' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView className="flex-1 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center space-x-2">
            <Text className="text-lg font-semibold">Mero Ward</Text>
          </View>
          <Feather name="bell" size={20} />
        </View>
       <View className="flex-row items-center mb-4">
      <TextInput
        className="flex-1 bg-gray-100 p-2 rounded-lg text-base"
        placeholder="Search"
        placeholderTextColor="#888"
      />  
      {/* Clickable Profile/Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/login")} 
        className="h-10 w-10 ml-3 rounded-full bg-gray-300 items-center justify-center"
      >
      </TouchableOpacity>
    </View>

        <Text className="text-lg text-primary font-semibold mb-4">Quick Access</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}
