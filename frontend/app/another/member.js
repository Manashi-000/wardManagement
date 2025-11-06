import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;

const MemberDetail = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchMembers = async () => {
    try {
      const endpoint = `${API_URL}/member/getmembers`;
      console.log("Fetching members from:", endpoint);

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch members");

      setMembers(data.data || data || []);
    } catch (err) {
      console.log("Fetch error:", err.message);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const renderCard = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>

        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => handleCall(item.phone)}
        >
          <Ionicons name="call" size={16} color="#003083" />
          <Text style={styles.phone}>{item.phone}</Text>
        </TouchableOpacity>

        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <Link href="/(tabs)/home">
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </Link>
          <Text style={styles.headerText}>Ward No. 17 - Members</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
            {error}
          </Text>
        ) : members.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#555", fontSize: 16 }}>
            No members found.
          </Text>
        ) : (
          <>
            {/* Optional: You can separate elected members vs employees if backend provides a type */}
            {members.map(renderCard)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },
  topHeader: {
    backgroundColor: "#003083",
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#fff", marginLeft: 12 },
  container: { padding: 20, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  image: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: "#003083", marginRight: 15 },
  info: { flex: 1, justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "bold", color: "#003083" },
  role: { fontSize: 14, color: "#4F6D7A", marginBottom: 6 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  phone: { fontSize: 14, color: "#0066cc", marginLeft: 6, fontWeight: "600" },
  description: { fontSize: 12, color: "#555", marginTop: 6, lineHeight: 16 },
});

export default MemberDetail;
