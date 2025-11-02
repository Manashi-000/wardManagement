import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { Link } from "expo-router";

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBaseUrl = () => {
    if (Platform.OS === "android") return "http://10.0.2.2:8000"; // Android emulator
    return "http://192.168.1.94:8000"; // iOS simulator or real device
  };

  const BASE_URL = getBaseUrl();

  const fetchContacts = async () => {
    try {
      console.log("Fetching from:", `${BASE_URL}/api/v1/emergency/get-emergencies`);
      const res = await fetch(`${BASE_URL}/api/v1/emergency/get-emergencies`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load contacts");

      setContacts(data.data || []);
    } catch (err) {
      console.log("Fetch error:", err.message);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const callNumber = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Link href="/(tabs)/home">
            <Text style={{ fontSize: 26, color: "#003083" }}>←</Text>
          </Link>
          <Text style={styles.headerText}>Emergency Contacts</Text>
        </View>

        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Dear Citizen,</Text>
          <Text style={styles.introText}>
            Your safety is our priority. Here are the important emergency services you may need at any time.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>{error}</Text>
        ) : (
          contacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => callNumber(contact.contact)}
            >
              <View style={styles.iconBox}>
                <Image
                  source={{ uri: contact.icon }}
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{contact.public_service}</Text>
                <Text style={styles.phone}>📞 {contact.contact}</Text>
                <Text style={styles.description}>{contact.description}</Text>
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
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#003083", marginLeft: 12 },
  introBox: { backgroundColor: "#e6f0ff", padding: 15, borderRadius: 12, marginBottom: 20 },
  introTitle: { fontSize: 16, fontWeight: "bold", color: "#003083", marginBottom: 5 },
  introText: { fontSize: 14, color: "#003083", lineHeight: 20 },
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
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#003083" },
  phone: { fontSize: 14, color: "#003083", marginVertical: 2 },
  description: { fontSize: 13, color: "#555" },
});

export default EmergencyContacts;
