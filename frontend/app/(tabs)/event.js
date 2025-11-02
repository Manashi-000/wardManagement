import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Modal, TouchableOpacity } from 'react-native';
import EventCard from '../../components/EventCard';

const eventsMock = [
  { id: 1, title: "Ward Meeting", date: "2025-08-30", description: "Monthly ward meeting at community hall." },
  { id: 2, title: "Health Camp", date: "2025-08-15", description: "Free health checkup for residents." },
  { id: 3, title: "Cultural Event", date: "2025-08-01", description: "Local cultural program celebration." },
];

const EventPage = () => {
  const [activeFilter, setActiveFilter] = useState("day");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  const filteredEvents = eventsMock.filter(event => {
    if (activeFilter === 'day') return event.date === today;
    if (activeFilter === 'month') return event.date.startsWith(currentMonth);
    return true;
  });

  const openEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeEvent = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header image/banner */}
      <View className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <Image
          source={require('../../assets/images/event.avif')}
          style={{ width: '100%', height: 160 }}
          resizeMode="cover"
          accessible
          accessibilityLabel="Community events banner"
        />
      </View>

      <Text className="text-3xl font-extrabold text-[#003083] mb-6">Upcoming Events</Text>

      {/* Filter Tabs */}
      <View className="flex-row justify-around mb-6 bg-gray-100 rounded-full py-1 shadow-sm">
        {["day", "month", "all"].map(filter => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full ${
              activeFilter === filter ? "bg-[#003083]" : "bg-transparent"
            }`}
          >
            <Text className={`text-base font-semibold ${
              activeFilter === filter ? "text-white" : "text-gray-600"
            } capitalize`}>
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Events List */}
      <ScrollView className="space-y-4" showsVerticalScrollIndicator={false}>
        {filteredEvents.length ? (
          filteredEvents.map(event => (
            <Pressable
              key={event.id}
              onPress={() => openEvent(event)}
              className="bg-[#F0F4FF] rounded-xl border border-[#003083] p-5 shadow-md flex-row items-center space-x-4 mb-3"
            >
              <View className="bg-[#003083] p-3 rounded-full mr-4">
                <Text className="text-white font-bold text-lg">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-[#003083]">{event.title}</Text>
                <Text className="text-sm text-gray-700 mb-1">{event.date}</Text>
                <Text
                  numberOfLines={2}
                  className="text-gray-600 italic"
                >
                  {event.description}
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text className="text-gray-500 text-center mt-20 text-lg">No events found.</Text>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeEvent}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <Text className="text-2xl font-bold text-[#003083] mb-4">{selectedEvent?.title}</Text>
            <Text className="text-gray-700 mb-4">{selectedEvent?.date}</Text>
            <Text className="text-gray-600 mb-6">{selectedEvent?.description}</Text>

            <TouchableOpacity
              onPress={closeEvent}
              className="self-end bg-[#003083] px-4 py-2 rounded-full"
              accessibilityRole="button"
              accessibilityLabel="Close event details"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventPage;
