
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
