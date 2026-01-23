import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      const endpoint = `${API_URL}/emergency/get-emergencies`;
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log("Fetched emergency data =>", data);

      // Update this based on your backend response
      setContacts(data.data || data.emergencies || []);
      setFilteredContacts(data.data || data.emergencies || []);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = contacts.filter((item) =>
      (item.public_service || item.name || "")
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const callNumber = (phone) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Link href="/(tabs)/home">
            <View style={styles.backCircle}>
              <Feather name="arrow-left" size={24} color="#003083" />
            </View>
          </Link>
          <Text style={styles.headerText}>Emergency Contacts</Text>
        </View>

        {/* Intro */}
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Dear Citizen,</Text>
          <Text style={styles.introText}>
            Your safety is our priority. Here are important emergency services
            you may need at any time.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Feather name="search" size={18} color="#003083" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search emergency service..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Contacts List */}
        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredContacts.length === 0 ? (
          <Text style={styles.noResultText}>No matching contacts found.</Text>
        ) : (
          filteredContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => callNumber(contact.contact)}
            >
              <View style={styles.iconBox}>
                <Image
                  source={{
                    uri:
                      contact.icon
                        ? `${API_URL.replace("/api/v1", "")}/uploads/${contact.icon}`
                        : "https://via.placeholder.com/55?text=Icon",
                  }}
                  style={styles.iconImage}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{contact.public_service}</Text>
                {contact.contact && <Text style={styles.phone}>📞 {contact.contact}</Text>}
                {contact.description && (
                  <Text style={styles.description}>{contact.description}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },
  container: { padding: 20, paddingBottom: 40, marginTop: 15 },

  /* Header */
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#d9e6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003083",
    marginLeft: 12,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  /* Intro */
  introBox: {
    backgroundColor: "#e6f0ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  introTitle: { fontSize: 16, fontWeight: "bold", color: "#003083", marginBottom: 5 },
  introText: { fontSize: 14, color: "#003083", lineHeight: 20 },

  /* Search */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0d7e2",
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: "#003083", paddingVertical: 10 },

  /* Contact Cards */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#d9e6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconImage: { width: 30, height: 30, resizeMode: "contain" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#003083", marginBottom: 4 },
  phone: { fontSize: 14, color: "#4F6F52", marginVertical: 2 },
  description: { fontSize: 13, color: "#555", lineHeight: 18 },

  /* Messages */
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  noResultText: { textAlign: "center", color: "#555", marginTop: 20 },
});

export default EmergencyContacts;
