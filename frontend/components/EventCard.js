import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CalendarDays } from 'lucide-react-native';

const EventCard = ({ event, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="p-4 bg-[#F0F4FF] rounded-xl border border-[#003083] flex-row items-center space-x-3"
    >
      <View className="bg-[#003083] p-2 rounded-full">
        <CalendarDays color="white" size={20} />
      </View>
      <View>
        <Text className="text-base font-semibold text-[#003083]">{event.title}</Text>
        <Text className="text-sm text-gray-600">{event.date}</Text>
      </View>
    </Pressable>
  );
};

export default EventCard;
