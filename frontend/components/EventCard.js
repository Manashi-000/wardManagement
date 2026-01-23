import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/organizations/organization/get-events/`);
      const data = await res.json();

      console.log("Fetched events:", data.data); // DEBUG

      if (!res.ok) throw new Error(data.message || "Failed to load events");

      const eventsWithOrg = data.data.map((event) => ({
        ...event,
        orgName: event.Organization?.name || "Unknown Organization",
        // Ensure eventDate is ISO string
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString() : null,
      }));

      setEvents(eventsWithOrg);
    } catch (err) {
      console.error("Error fetching events:", err.message);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events
  const filteredEvents = events.filter((event) => {
    if (!event.eventDate) return true; // show even if no date
    if (activeFilter === "day") return event.eventDate.split("T")[0] === today;
    if (activeFilter === "month") return event.eventDate.startsWith(currentMonth);
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {["day", "month", "all"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
            >
              <Text
                style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}
              >
                {filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Events List */}
        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>{error}</Text>
        ) : filteredEvents.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#555", fontSize: 16 }}>
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
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.orgName}>Organization: {event.orgName}</Text>
                <Text style={styles.eventDate}>
                  Date: {event.eventDate ? formatDate(event.eventDate) : "Not available"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for Event Details */}
      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={closeEvent}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedEvent?.name}</Text>
            <Text style={styles.modalOrg}>Organization: {selectedEvent?.orgName}</Text>
            <Text style={styles.modalDate}>
              Date: {selectedEvent?.eventDate ? formatDate(selectedEvent.eventDate) : "Not available"}
            </Text>
            <Text style={styles.modalDesc}>
              {selectedEvent?.eventDescription || "No description provided."}
            </Text>

            <TouchableOpacity onPress={closeEvent} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },
  container: { padding: 20, paddingBottom: 40, marginTop: 15 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#003083", marginLeft: 12 },
  filterTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e6f0ff",
    borderRadius: 30,
    paddingVertical: 5,
    marginBottom: 20,
  },
  filterButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
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
  orgName: { fontSize: 13, color: "#4F6F52", marginVertical: 2 },
  eventDate: { fontSize: 13, color: "#003083", marginVertical: 2 },
  eventDesc: { fontSize: 13, color: "#555" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { backgroundColor: "#fff", borderRadius: 15, padding: 20, width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#003083", marginBottom: 5 },
  modalOrg: { color: "#4F6F52", marginBottom: 5, fontWeight: "600" },
  modalDate: { color: "#003083", marginBottom: 10 },
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
