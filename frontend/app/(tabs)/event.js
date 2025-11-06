import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;
console.log("this is backend url in event", API_URL);

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  
  const fetchEvents = async () => {
  try {
    const endpoint = `${API_URL}/organizations/organization/get-events/`;
    console.log("Fetching from:", endpoint);

    const res = await fetch(endpoint);
    const data = await res.json(); // ✅ parse JSON

    // console.log("Fetched event data:", data); // 👈 add this line

    if (!res.ok) throw new Error(data.message || "Failed to load events");

    setEvents(data.data || data.events || data || []);
  } catch (err) {
    console.log("Fetch error:", err.message);
    setError(err.message || "Network error");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (activeFilter === "day") return event.date === today;
    if (activeFilter === "month") return event.date?.startsWith(currentMonth);
    return true;
  });

  const openEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Link href="/(tabs)/home">
            <Text style={{ fontSize: 26, color: "#003083" }}>←</Text>
          </Link>
          <Text style={styles.headerText}>Upcoming Events</Text>
        </View>

        {/* Banner */}
        <View style={styles.bannerBox}>
          <Image
            source={require("../../assets/images/event.avif")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {["day", "month", "all"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data states */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#003083"
            style={{ marginTop: 30 }}
          />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
            {error}
          </Text>
        ) : filteredEvents.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              color: "#555",
              fontSize: 16,
            }}
          >
            No events found.
          </Text>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => openEvent(event)}
            >
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>📅</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventDesc} numberOfLines={2}>
                  {event.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeEvent}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalDate}>{selectedEvent?.date}</Text>
            <Text style={styles.modalDesc}>{selectedEvent?.description}</Text>

            <TouchableOpacity
              onPress={closeEvent}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },
  container: { padding: 20, paddingBottom: 40, marginTop: 15 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003083",
    marginLeft: 12,
  },
  bannerBox: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
  },
  bannerImage: { width: "100%", height: 160 },
  filterTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e6f0ff",
    borderRadius: 30,
    paddingVertical: 5,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeFilter: { backgroundColor: "#003083" },
  filterText: { color: "#003083", fontWeight: "600" },
  activeFilterText: { color: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d9e6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconText: { fontSize: 22 },
  info: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: "bold", color: "#003083" },
  eventDate: { fontSize: 14, color: "#003083", marginVertical: 2 },
  eventDesc: { fontSize: 13, color: "#555" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003083",
    marginBottom: 8,
  },
  modalDate: { color: "#555", marginBottom: 10 },
  modalDesc: { color: "#444", marginBottom: 15 },
  closeButton: {
    backgroundColor: "#003083",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  closeText: { color: "#fff", fontWeight: "bold" },
});

export default EventPage;
