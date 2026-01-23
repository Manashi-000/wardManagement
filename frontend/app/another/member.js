import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;

const WardMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      const endpoint = `${API_URL}/member/get-members`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load members");

      setMembers(data.members || []);
      setFilteredMembers(data.members || []);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = members.filter((m) =>
      m.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const callNumber = (phone) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const representatives = filteredMembers.filter(
    (m) => m.classification === "REPRESENTATIVE"
  );
  const publicServices = filteredMembers.filter(
    (m) => m.classification === "PUBLIC_SERVICE"
  );

  const getImageUri = (image) =>
    image ? `${API_URL.replace("/api/v1", "")}/uploads/${image}` : "https://via.placeholder.com/70?text=User";

  const renderMemberCard = (member, badgeText, badgeStyle) => (
    <View key={member.id} style={styles.card}>
      <Image source={{ uri: getImageUri(member.image) }} style={styles.profileImage} />
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.position}>{member.position}</Text>
        {member.contactNumber && (
          <TouchableOpacity onPress={() => callNumber(member.contactNumber)}>
            <Text style={styles.phone}>📞 {member.contactNumber}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.badgeWrapper}>
          <Text style={[styles.badge, badgeStyle]}>{badgeText}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {/* Top Fixed Section */}
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Link href="/(tabs)/home">
            <View style={styles.backCircle}>
              <Feather name="arrow-left" size={24} color="#003083" />
            </View>
          </Link>
          <Text style={styles.headerText}>Ward Members</Text>
        </View>

        {/* Intro */}
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Meet Your Representatives</Text>
          <Text style={styles.introText}>
            Below are your elected ward officials and representatives serving the community with dedication.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Feather name="search" size={18} color="#003083" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Scrollable List */}
      <View style={styles.listWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredMembers.length === 0 ? (
          <Text style={styles.noResultText}>No members found.</Text>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {representatives.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Representatives</Text>
                {representatives.map((m) => renderMemberCard(m, "REPRESENTATIVE", styles.repBadge))}
              </View>
            )}
            {publicServices.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Public Services</Text>
                {publicServices.map((m) => renderMemberCard(m, "PUBLIC SERVICE", styles.serviceBadge))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },

  topSection: { paddingHorizontal: 20, paddingTop: 15, backgroundColor: "#f2f6ff" },

  listWrapper: { flex: 1, paddingHorizontal: 20 },

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
  headerText: { fontSize: 22, fontWeight: "bold", color: "#003083", marginLeft: 12 },

  /* Intro */
  introBox: { backgroundColor: "#e6f0ff", padding: 15, borderRadius: 12, marginBottom: 20 },
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

  /* Section Titles */
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#003083", marginBottom: 12 },

  /* Cards */
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
  profileImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#d9e6ff", marginRight: 15 },
  info: { flex: 1, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "bold", color: "#003083" },
  position: { fontSize: 14, color: "#4F6F52", marginVertical: 4 },
  phone: { fontSize: 13, color: "#003083", marginTop: 4 },
  badgeWrapper: { marginTop: 8 },
  badge: { alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, fontSize: 12, fontWeight: "600", color: "#fff" },
  repBadge: { backgroundColor: "#003083" },
  serviceBadge: { backgroundColor: "#4F6F52" },

  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  noResultText: { textAlign: "center", color: "#555", marginTop: 20 },
});

export default WardMembers;
