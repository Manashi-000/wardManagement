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
import { Ionicons } from "@expo/vector-icons";

const API_URL = Constants.expoConfig?.extra?.backendURL;

// format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toDateString();
};

// LOCAL date helpers (timezone safe)
const getLocalDate = (dateInput) => {
  const d = new Date(dateInput);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const getLocalMonth = (dateInput) => {
  const d = new Date(dateInput);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // fetch events
  const fetchEvents = async () => {
    try {
      const endpoint = `${API_URL}/organizations/organization/get-events/`;
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load events");

      const eventsWithOrg = data.data.map((event) => ({
        ...event,
        orgName: event.Organization?.name || "Unknown Organization",
      }));

      setEvents(eventsWithOrg);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔥 FIXED FILTER LOGIC (LOCAL TIME)
  const todayLocal = getLocalDate(new Date());
  const currentMonth = getLocalMonth(new Date());

  const filteredEvents = events.filter((event) => {
    if (!event.eventDate) return false;

    const eventDay = getLocalDate(event.eventDate);
    const eventMonth = getLocalMonth(event.eventDate);

    if (activeFilter === "day") {
      return eventDay === todayLocal;
    }

    if (activeFilter === "month") {
      return eventMonth === currentMonth;
    }

    return true; // all
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

        {/* Events */}
        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredEvents.length === 0 ? (
          <Text style={styles.emptyText}>No events found.</Text>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => openEvent(event)}
            >
              <View style={styles.iconBox}>
                <Ionicons name="calendar" size={20} color="#003083" />
              </View>

              <View style={styles.info}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.orgName}>{event.orgName}</Text>
                <Text style={styles.eventDate}>
                  {formatDate(event.eventDate)}
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
            <Text style={styles.modalTitle}>{selectedEvent?.name}</Text>
            <Text style={styles.modalOrg}>
              Organization: {selectedEvent?.orgName}
            </Text>
            <Text style={styles.modalDate}>
              Date: {formatDate(selectedEvent?.eventDate)}
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

// styles (unchanged look)
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
    paddingVertical: 6,
    marginBottom: 20,
  },
  filterButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  activeFilter: { backgroundColor: "#003083" },
  filterText: { color: "#003083", fontWeight: "600" },
  activeFilterText: { color: "#fff" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
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

  info: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: "bold", color: "#003083" },
  orgName: { fontSize: 13, color: "#4F6F52", marginVertical: 2 },
  eventDate: { fontSize: 13, color: "#003083" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#003083" },
  modalOrg: { color: "#4F6F52", marginVertical: 5, fontWeight: "600" },
  modalDate: { color: "#003083", marginBottom: 10 },
  modalDesc: { color: "#444", marginBottom: 15 },

  closeButton: {
    backgroundColor: "#003083",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  closeText: { color: "#fff", fontWeight: "bold" },

  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#555", fontSize: 16 },
});

export default EventPage;
