import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const API_URL = Constants.expoConfig?.extra?.backendURL;

const MapScreen = () => {
	const [organizations, setOrganizations] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const router = useRouter()

	useEffect(() => {
		const fetchOrgs = async () => {
			try {
				const res = await fetch(`${API_URL}/organizations/get-organizations`);
				const data = await res.json();
				setOrganizations(data.data);
			} catch (err) {
				console.error("Error fetching orgs:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrgs();
	}, []);

	if (loading) {
		return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0000ff" />;
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={organizations}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.orgCard}
						onPress={() => router.push(`/organization/${item.id}`)}
					>
						<Image source={{ uri: item.image }} style={styles.orgImage} />
						<View style={{ flex: 1 }}>
							<Text style={styles.orgName}>{item.name}</Text>
							<Text style={styles.orgDesc}>{item.description}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	orgCard: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
	orgImage: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
	orgName: { fontWeight: "bold", fontSize: 16 },
	orgDesc: { color: "#555" },
});

export default MapScreen;
