import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.backendURL;

export default function PoliciesScreen() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // ✅ Fetch all policies (no organizationId needed)
  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${API_URL}/organizations/organization/get-policies`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load policies");

      // Backend might send data as 'policyExist' or 'policies'
      const policiesData = data.policies || data.policyExist || [];
      setPolicies(policiesData);
    } catch (err) {
      console.error("Error fetching policies:", err.message);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openPolicy = (policy) => {
    setSelectedPolicy(policy);
    setModalVisible(true);
  };

  const closePolicy = () => {
    setSelectedPolicy(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>All Organization Policies</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#003083" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : policies.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#555", fontSize: 16 }}>
            No policies found.
          </Text>
        ) : (
          policies.map((policy) => (
            <TouchableOpacity
              key={policy.id}
              style={styles.card}
              onPress={() => openPolicy(policy)}
              activeOpacity={0.8}
            >
              <Text style={styles.policyName}>{policy.policyName}</Text>
              <Text style={styles.policyDesc}>
                {policy.policyDescription.length > 80
                  ? policy.policyDescription.slice(0, 80) + "..."
                  : policy.policyDescription}
              </Text>
              <Text style={styles.policyDate}>
                Created At: {new Date(policy.createdAt || policy.createAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for full policy details */}
      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={closePolicy}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedPolicy?.policyName}</Text>
            <Text style={styles.modalDesc}>
              {selectedPolicy?.policyDescription || "No description available."}
            </Text>
            <Text style={styles.modalDate}>
              Created At: {selectedPolicy ? new Date(selectedPolicy.createdAt || selectedPolicy.createAt).toLocaleDateString() : ""}
            </Text>

            <TouchableOpacity onPress={closePolicy} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f6ff" },
  container: { padding: 20, paddingBottom: 40, marginTop: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#003083" },
  card: {
    backgroundColor: "#e6f0ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  policyName: { fontSize: 16, fontWeight: "bold", color: "#003083" },
  policyDesc: { fontSize: 14, color: "#555", marginVertical: 5 },
  policyDate: { fontSize: 12, color: "#003083" },
  error: { color: "red", fontSize: 16, textAlign: "center", marginTop: 20 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { backgroundColor: "#fff", borderRadius: 15, padding: 20, width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#003083", marginBottom: 10 },
  modalDesc: { color: "#444", marginBottom: 15 },
  modalDate: { color: "#003083", marginBottom: 15 },
  closeButton: {
    backgroundColor: "#003083",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  closeText: { color: "#fff", fontWeight: "bold" },
});
