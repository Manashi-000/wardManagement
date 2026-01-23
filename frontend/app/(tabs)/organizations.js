import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	Text,
	Image,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = Constants.expoConfig?.extra?.backendURL;

const MapScreen = () => {
	const [organizations, setOrganizations] = useState([]);
	const [filteredOrgs, setFilteredOrgs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchText, setSearchText] = useState("");
	const router = useRouter();

	useEffect(() => {
		const fetchOrgs = async () => {
			try {
				const res = await fetch(`${API_URL}/organizations/get-organizations`);
				const data = await res.json();
				setOrganizations(data.data);
				setFilteredOrgs(data.data);
			} catch (err) {
				console.error("Error fetching orgs:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrgs();
	}, []);

	const handleSearch = (text) => {
		setSearchText(text);
		const filtered = organizations.filter((org) =>
			org.name.toLowerCase().includes(text.toLowerCase())
		);
		setFilteredOrgs(filtered);
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#003083" />
				<Text style={styles.loadingText}>Loading organizations...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
			<Stack.Screen options={{ headerShown: false }} />

			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Organizations</Text>
				</View>

				<View style={styles.searchContainer}>
					<TextInput
						value={searchText}
						onChangeText={handleSearch}
						placeholder="Search organizations..."
						style={styles.searchInput}
						placeholderTextColor="#00308390"
					/>
				</View>

				{/* List */}
				<FlatList
					data={filteredOrgs}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.orgCard}
							activeOpacity={0.8}
							onPress={() => router.push(`/organization/${item.id}`)}
						>
							<Image source={{ uri: item.image }} style={styles.orgImage} />
							<View style={styles.orgDetails}>
								<Text style={styles.orgName}>{item.name}</Text>
								<Text style={styles.orgDesc} numberOfLines={2}>
									{item.description}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F2F6FA",
	},
	container: {
		flex: 1,
		backgroundColor: "#F2F6FA",
	},
	header: {
		backgroundColor: "#003083",
		paddingVertical: 18,
		alignItems: "center",
		borderBottomLeftRadius: 18,
		borderBottomRightRadius: 18,
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 5,
	},
	headerTitle: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "700",
		letterSpacing: 0.4,
	},
	searchContainer: {
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	searchInput: {
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 25,
		fontSize: 15,
		color: "#003083",
		elevation: 3,
		shadowColor: "#003083",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 5,
	},
	orgCard: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 12,
		marginBottom: 14,
		shadowColor: "#003083",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 5,
		elevation: 2,
	},
	orgImage: {
		width: 70,
		height: 70,
		borderRadius: 12,
		marginRight: 12,
	},
	orgDetails: {
		flex: 1,
		justifyContent: "center",
	},
	orgName: {
		fontSize: 17,
		fontWeight: "700",
		color: "#003083",
		marginBottom: 4,
	},
	orgDesc: {
		fontSize: 14,
		color: "#4F6F52",
		lineHeight: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F2F6FA",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 15,
		color: "#4F6F52",
	},
});

export default MapScreen;
