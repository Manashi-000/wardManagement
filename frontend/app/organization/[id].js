import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = Constants.expoConfig?.extra?.backendURL;

export default function OrganizationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await fetch(`${API_URL}/organizations/getOrganization/${id}`);
        const data = await res.json();
        setOrganization(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrg();
  }, [id]);

  // ✅ Fetch organization policies
  useEffect(() => {
    if (!id) return;

    const fetchPolicies = async () => {
      try {
        setLoadingPolicies(true);
        const res = await fetch(`${API_URL}/organizations/organization/get-policies/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load policies");

        setPolicies(data.policies || []);
      } catch (err) {
        console.error("Error fetching policies:", err.message);
        setPolicies([]);
      } finally {
        setLoadingPolicies(false);
      }
    };

    fetchPolicies();
  }, [id]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003083" />
        <Text style={styles.loadingText}>Loading organization details...</Text>
      </View>
    );

  if (!organization) return <Text>Organization not found</Text>;
  if (!organization.latitude || !organization.longitude)
    return <Text>Location data not available</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.fixedContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          <StatusBar barStyle="light-content" backgroundColor="#003083" />

          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.push("/(tabs)/organizations")}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageWrapper}>
            <Image source={{ uri: organization.image }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={styles.imageTextContainer}>
              <Text style={styles.imageTitle}>{organization.name}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionHeader}>About the Organization</Text>
            <Text style={styles.description}>{organization.description}</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#4F6F52" />
              <Text style={styles.established}>
                Established:{" "}
                <Text style={styles.establishedDate}>
                  {new Date(organization.establishedAt).toDateString()}
                </Text>
              </Text>
            </View>

            <View style={styles.divider} />

            {/* ✅ Policies Section */}
            <Text style={styles.sectionHeader}>Organization Policies</Text>
            {loadingPolicies ? (
              <ActivityIndicator size="small" color="#003083" style={{ marginVertical: 10 }} />
            ) : policies.length === 0 ? (
              <Text style={{ color: "#555", fontSize: 14, marginVertical: 10 }}>
                No policies found.
              </Text>
            ) : (
              policies.map((policy) => (
                <View key={policy.id} style={styles.policyCard}>
                  <Text style={styles.policyName}>{policy.policyName}</Text>
                  <Text style={styles.policyDesc}>
                    {policy.policyDescription.length > 80
                      ? policy.policyDescription.slice(0, 80) + "..."
                      : policy.policyDescription}
                  </Text>
                  <Text style={styles.policyDate}>
                    Created At: {new Date(policy.createAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Location</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: Number(organization.latitude),
                  longitude: Number(organization.longitude),
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.001,
                }}
                pointerEvents="none"
              >
                <Marker
                  coordinate={{
                    latitude: Number(organization.latitude),
                    longitude: Number(organization.longitude),
                  }}
                  title={organization.name}
                  description="Organization location"
                />
              </MapView>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F1F5F9" },
  fixedContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#003083",
    padding: 10,
    borderRadius: 50,
    elevation: 8,
  },
  imageWrapper: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#003083",
  },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  imageTextContainer: { position: "absolute", bottom: 20, left: 20 },
  imageTitle: { color: "#fff", fontSize: 28, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: "#003083",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  sectionHeader: { fontSize: 18, fontWeight: "700", color: "#003083", marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, color: "#4F6F52", textAlign: "justify" },
  divider: { height: 1, backgroundColor: "#E3E8EF", marginVertical: 14 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  established: { fontSize: 15, color: "#444" },
  establishedDate: { color: "#003083", fontWeight: "600" },
  mapContainer: { width: "100%", height: 300, borderRadius: 16, overflow: "hidden", borderWidth: 0.6, borderColor: "#00308330" },
  map: { width: "100%", height: "100%" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F7FA" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#4F6F52" },

  // ✅ Policy Card Styles
  policyCard: { backgroundColor: "#e6f0ff", padding: 12, borderRadius: 12, marginVertical: 6 },
  policyName: { fontSize: 15, fontWeight: "700", color: "#003083" },
  policyDesc: { fontSize: 14, color: "#555", marginVertical: 4 },
  policyDate: { fontSize: 12, color: "#003083" },
});
