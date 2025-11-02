import React from "react";
import { View, Text, ScrollView, Image } from "react-native";

export default function WardActivities() {
  // Sample activities with images
  const activities = [
    {
      id: 2,
      title: "Health Camp",
      description: "Free health camp organized for local residents.",
      date: "2025-08-22",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFXnfa4yvohlC3V4G-ux6eY6yyM1fuZM60Fw&s",
    },
    {
      id: 3,
      title: "Tree Plantation",
      description: "Ward officials planted 200 trees in the community park.",
      date: "2025-08-25",
      image: "https://img.freepik.com/premium-photo/two-diverse-activists-working-together-plant-more-trees-greenery_482257-97762.jpg?semt=ais_hybrid&w=740&q=80",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-blue-50 p-9">
      <Text className="text-3xl font-bold mb-6 text-center text-[#003083]">
        🌿 Ward Activities
      </Text>

      {activities.map((activity) => (
        <View
          key={activity.id}
          className="bg-white rounded-2xl mb-6 shadow-lg overflow-hidden"
        >
          {/* Activity Image */}
          <Image
            source={{ uri: activity.image }}
            className="w-full h-48"
            resizeMode="cover"
          />

          {/* Content */}
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {activity.title}
            </Text>
            <Text className="text-gray-600 mb-2">{activity.description}</Text>
            <Text className="text-sm text-gray-500">📅 {activity.date}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
