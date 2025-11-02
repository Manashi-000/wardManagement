import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const MemberDetail = () => {
  const electedMembers = [
    {
      id: "1",
      name: "Nabin Manandhar",
      role: "Ward Chairperson",
      phone: "9851279917",
      description:
        "Leads Ward No. 17 and coordinates development, planning, and administration.",
      image:
        "https://kathmandu.gov.np/wp-content/uploads/2022/06/viber_image_2023-01-16_07-30-43-326-271x300-1.jpg",
    },
    {
      id: "2",
      name: "Jitendra Khadgi",
      role: "Ward Member",
      phone: "9841449493",
      description:
        "Represents the community in decision making and local programs.",
      image: "https://kathmandu.gov.np/wp-content/uploads/2022/06/jitendra.jpg",
    },
    {
      id: "3",
      name: "Shambhu Podhe",
      role: "Ward Member",
      phone: "9851109082",
      description:
        "Supports social inclusion and development activities within the ward.",
      image: "https://kathmandu.gov.np/wp-content/uploads/2022/06/shambhu.jpg",
    },
  ];

  const employees = [
    {
      id: "4",
      name: "Rajesh Shrestha",
      role: "Ward Secretary",
      phone: "9851162255",
      description: "Handles ward administration and documentation.",
      image: "https://kathmandu.gov.np/wp-content/uploads/2022/07/rajesh.jpg",
    },
    {
      id: "5",
      name: "Savitri Shrestha",
      role: "Officer",
      phone: "9841434729",
      description: "Supports day-to-day ward office activities and public services.",
      image: "https://kathmandu.gov.np/wp-content/themes/kmc-theme/images/officer-avtar.png",
    },
    {
      id: "6",
      name: "Laxmi Shrestha",
      role: "Engineer",
      phone: "9841241200",
      description:
        "Responsible for infrastructure, planning, and technical works in the ward.",
      image: "https://kathmandu.gov.np/wp-content/themes/kmc-theme/images/officer-avtar.png",
    },
  ];

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

        {/* Phone clickable */}
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
        {/* Elected Representatives */}
        <Text style={styles.sectionTitle}>Elected Representatives</Text>
        {electedMembers.map(renderCard)}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Employees */}
        <Text style={styles.sectionTitle}>Ward Employees</Text>
        {employees.map(renderCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f6ff",
  },
  topHeader: {
    backgroundColor: "#003083",
    paddingVertical:30,
    paddingHorizontal:16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#003083",
    marginBottom: 12,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#d9d9d9",
    marginVertical: 15,
  },
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#003083",
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003083",
  },
  role: {
    fontSize: 14,
    color: "#4F6D7A",
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#0066cc",
    marginLeft: 6,
    fontWeight: "600",
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
    lineHeight: 16,
  },
});

export default MemberDetail;
