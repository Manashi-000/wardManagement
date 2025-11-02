import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft, FileText, Download } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function DocumentDetail() {
  const router = useRouter();

  // Example related documents
  const relatedDocs = [
    { id: 1, title: "Death Certificate", date: "2023-07-20" },
    { id: 2, title: "Land Ownership", date: "2023-06-10" },
    { id: 3, title: "Tax Clearance", date: "2022-12-05" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 pb-3 mb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1 rounded-full bg-gray-200"
        >
          <ArrowLeft size={20} color="" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold">
          Document Detail
        </Text>
        <View className="w-6" /> {/* spacer */}
      </View>

      {/* Ward Info */}
      <Text className="text-center text-sm text-gray-500 mb-4">
        Ward No. 17 – Chhetrapati
      </Text>

      {/* Document Card */}
      <View className="bg-white rounded-2xl shadow-md p-4 mb-6">
        {/* Document Image */}
        <View className="rounded-xl overflow-hidden mb-4">
          <Image
            source={require("../../assets/images/image.png")}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>

        {/* Document Info */}
        <View className="mb-4">
          <Text className="text-xl font-bold mb-1">Birth Certificate</Text>
          <Text className="text-sm text-gray-600">
            Issuing Authority: Ward Office
          </Text>
          <Text className="text-sm text-gray-600">
            Document ID: <Text className="font-mono">1234567890</Text>
          </Text>
          <Text className="text-sm text-gray-600">
            Issued Date: <Text className="font-medium">2023-08-15</Text>
          </Text>
        </View>

        {/* Download Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-blue-600 py-3 rounded-xl flex-row items-center justify-center"
        >
          <Download size={18} color="white" />
          <Text className="text-white text-center font-medium ml-2">
            Download / View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes Section */}
      <View className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <Text className="text-lg font-semibold mb-2">Notes</Text>
        <Text className="text-sm text-gray-700 leading-relaxed">
          This document is an official record of birth, issued by the Ward
          Office of Ward No. 17 (Chhetrapati), Kathmandu. It contains essential
          information about the birth, including the date, time, and place of
          birth, as well as the names of the parents.
        </Text>
      </View>

      {/* Related Documents */}
      <View className="bg-white rounded-2xl shadow-md p-4 mb-10">
        <Text className="text-lg font-semibold mb-3">
          Related Documents
        </Text>
        {relatedDocs.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            activeOpacity={0.7}
            className="flex-row items-center justify-between py-3 border-b border-gray-200 last:border-0"
          >
            <View className="flex-row items-center gap-2">
              <FileText size={20} color="#2563eb" />
              <View>
                <Text className="font-medium">{doc.title}</Text>
                <Text className="text-xs text-gray-500">{doc.date}</Text>
              </View>
            </View>
            <Text className="text-blue-600 font-semibold">View</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
