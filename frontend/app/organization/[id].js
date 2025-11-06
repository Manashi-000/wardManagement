import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, ActivityIndicator, FlatList, Text, Image, TouchableOpacity } from "react-native";

const API_URL = Constants.expoConfig?.extra?.backendURL;

export default function OrganizationDetails() {
    const { id } = useLocalSearchParams();
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const res = await fetch(`${API_URL}/organizations/getOrganization/${id}`);
                const data = await res.json();

                console.log("thisis dynamic id orgianizatio", data)
                setOrganization(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();
    }, [id]);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0000ff" />;
    if (!organization) return <Text>Organization not found</Text>;
    if (!organization.latitude || !organization.longitude) return <Text>Location data not available</Text>;
    console.log("this is organization longitude and latitude", organization.longitude, organization.latitude)
    return (
        <View style={styles.container}>
            <Image source={{ uri: organization.image }} style={styles.image} />
            <Text style={styles.name}>{organization.name}</Text>
            <Text style={styles.description}>{organization.description}</Text>
            <Text>Established: {new Date(organization.establishedAt).toDateString()}</Text>

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: Number(organization.latitude),
                        longitude: Number(organization.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{ latitude: Number(organization.latitude), longitude: Number(organization.longitude) }}
                        title={organization.name}
                        description="The city by the bay"
                    />
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
    name: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
    description: { fontSize: 16, color: "#555", marginBottom: 10 },

    mapContainer: {
        width: "100%",
        height: 300,
        marginTop: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        width: "100%",
        height: "100%",
    },
});