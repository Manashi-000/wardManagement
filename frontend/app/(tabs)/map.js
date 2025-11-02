// // MapScreen.js
// import React, { useRef, useEffect } from "react";
// import { View, StyleSheet, Dimensions, Text } from "react-native";
// import MapView, { Marker, Polygon, Callout } from "react-native-maps";
// import { useGetOrganizations } from "../../hooks/useGetOrganizations";

// // Example coordinates for Ward 17 polygon (replace with actual boundary data)
// const ward17Polygon = [
//   { latitude: 27.722, longitude: 85.313 },
//   { latitude: 27.725, longitude: 85.320 },
//   { latitude: 27.720, longitude: 85.325 },
//   { latitude: 27.718, longitude: 85.318 },
// ];

// // Example street/POI markers inside the ward
// const markers = [
//   { latitude: 27.721, longitude: 85.317, title: "School" },
//   { latitude: 27.723, longitude: 85.321, title: "Hospital" },
//   { latitude: 27.719, longitude: 85.319, title: "Market" },
// ];

// export default function MapScreen() {
//   const mapRef = useRef(null);
//   const { organizations } = useGetOrganizations()
//   // Auto-zoom to ward polygon when screen loads
//   useEffect(() => {
//     if (mapRef.current) {
//       mapRef.current.fitToCoordinates(ward17Polygon, {
//         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//         animated: true,
//       });
//     }
//   }, []);

//   return (
//     <View style={styles.container}>
//       <MapView ref={mapRef} style={styles.map}>
//         {/* Ward 17 Polygon */}
//         <Polygon
//           coordinates={ward17Polygon}
//           strokeColor="#FF5722" // border color
//           fillColor="rgba(255, 87, 34, 0.3)rr" // transparent fill*
//           strokeWidth={3}
//           tappable={true}
//           onPress={() => alert("This is Kathmandu Ward 17")}
//         />

//         {/* Markers inside Ward */}
//         {markers.map((marker, index) => (
//           <Marker
//             key={index}
//             coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
//           >
//             <Callout>
//               <Text>{marker.title}</Text>
//             </Callout>
//           </Marker>
//         ))}
//       </MapView>

//       {/* Header Overlay */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Kathmandu Ward 17</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   header: {
//     position: "absolute",
//     top: 40,
//     alignSelf: "center",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },
//   headerText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// import React from "react";
// import { StyleSheet, View, Dimensions } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// export default function MapScreen() {
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         provider="google" // force Google Maps provider
//         initialRegion={{
//           latitude: 37.78825,    // Example: San Francisco
//           longitude: -122.4324,
//           latitudeDelta: 0.0922, // zoom level
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker
//           coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
//           title="Hello"
//           description="This is a marker on the map"
//         />
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
// });

// import { useEffect, useState } from "react";
// import {
// 	ActivityIndicator,
// 	View,
// 	Text,
// 	StyleSheet,
// 	Dimensions,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import MapView, { Marker } from "react-native-maps";

// export default function MapScreen() {
// 	const [mapUrl, setMapUrl] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(false);

// 	useEffect(() => {
// 		const fetchOrganizations = async () => {
// 			try {
// 				const BASE_URL = "http://10.0.2.2:8000"; // change for real device if needed
// 				const res = await fetch(
// 					`${BASE_URL}/api/v1/organizations/get-organizations`
// 				);
// 				const json = await res.json();
// 				console.log("Fetched data:", json);

// 				if (
// 					!json.success ||
// 					!Array.isArray(json.data) ||
// 					json.data.length === 0
// 				) {
// 					console.warn("No organizations found");
// 					setError(true);
// 					return;
// 				}

// 				const start = json.data[0]?.name;
// 				const waypoints = json.data
// 					.slice(1)
// 					.map((org) => encodeURIComponent(org.name))
// 					.join("/");

// 				const url = `https://www.google.com/maps/dir/${encodeURIComponent(
// 					start
// 				)}/${waypoints}`;
// 				console.log("Map URL:", url);

// 				if (!start || !url.includes("google.com")) {
// 					setError(true);
// 				} else {
// 					setMapUrl(url);
// 				}
// 			} catch (err) {
// 				console.error("Error fetching organizations:", err);
// 				setError(true);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchOrganizations();
// 	}, []);

// 	// Loading spinner while fetching
// 	if (loading) {
// 		return (
// 			<View style={styles.center}>
// 				<ActivityIndicator
// 					size="large"
// 					color="blue"
// 				/>
// 			</View>
// 		);
// 	}

// 	// Fallback map when URL fails
// 	if (error || !mapUrl) {
// 		return (
// 			<View style={styles.container}>
// 				<MapView
// 					style={styles.map}
// 					initialRegion={{
// 						latitude: 27.7172, // Kathmandu as fallback
// 						longitude: 85.324,
// 						latitudeDelta: 0.05,
// 						longitudeDelta: 0.05,
// 					}}
// 				>
// 					<Marker
// 						coordinate={{ latitude: 27.7172, longitude: 85.324 }}
// 						title="Fallback Location"
// 						description="Could not load directions"
// 					/>
// 				</MapView>

// 				<View style={styles.overlay}>
// 					<Text style={styles.text}>Showing fallback map</Text>
// 				</View>
// 			</View>
// 		);
// 	}

// 	// WebView if URL is valid
// 	return (
// 		<WebView
// 			source={{ uri: mapUrl }}
// 			style={{ flex: 1 }}
// 		/>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// 	map: {
// 		width: Dimensions.get("window").width,
// 		height: Dimensions.get("window").height,
// 	},
// 	center: {
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	overlay: {
// 		position: "absolute",
// 		bottom: 40,
// 		alignSelf: "center",
// 		backgroundColor: "rgba(0,0,0,0.6)",
// 		paddingHorizontal: 12,
// 		paddingVertical: 6,
// 		borderRadius: 8,
// 	},
// 	text: {
// 		color: "#fff",
// 		fontSize: 14,
// 	},
// });

import Constants from "expo-constants";
import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const API_URL = Constants.expoConfig?.extra?.backendURL;

console.log("this is backend url", API_URL);
const MapScreen = () => {
	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: 37.78825,
					longitude: -122.4324,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
			>
				<Marker
					coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
					title="San Francisco"
					description="The city by the bay"
				/>
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: "100%",
	},
});

export default MapScreen;
