import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function TabsLayout() {
	return (
		<>
			<View style={styles.tabBarBackground}>
				<View style={styles.curveCutout} />
			</View>

			<Tabs
				screenOptions={({ route }) => ({
					tabBarActiveTintColor: "#003083",
					tabBarInactiveTintColor: "#777",
					headerShown: false,
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: "transparent",
						position: "absolute",
						height: 90,
						borderTopWidth: 0,
						elevation: 0,
					},
					tabBarLabelStyle: {
						fontSize: 12,
					},
					tabBarIcon: ({ color, focused }) => {
						let iconName;

						switch (route.name) {
							case "organizations":
								iconName = focused ? "organization" : "organization-outline";
								break;
							case "home":
								iconName = focused ? "home" : "home-outline";
								break;
							case "complaint":
								iconName = focused
									? "chatbox-ellipses"
									: "chatbox-ellipses-outline";
								break;
							case "post":
								iconName = focused ? "document-text" : "document-text-outline";
								break;
							case "event":
								iconName = focused ? "calendar" : "calendar-outline";
								break;
							default:
								iconName = "help-circle-outline";
						}

						return (
							<Ionicons
								name={iconName}
								size={22}
								color={color}
							/>
						);
					},
				})}
			>
				<Tabs.Screen
					name="home"
					options={{ title: "Home" }}
				/>
				<Tabs.Screen
					name="post"
					options={{ title: "Post" }}
				/>

				<Tabs.Screen
					name="organizations"
					options={{
						title: "Organizations",
						tabBarButton: (props) => (
							<TouchableOpacity
								{...props}
								style={styles.floatingButton}
								activeOpacity={0.8}
							>
								<MaterialCommunityIcons
									name="map-marker-radius"
									size={32}
									color="#fff"
								/>
							</TouchableOpacity>
						),
					}}
				/>

				<Tabs.Screen
					name="event"
					options={{ title: "Event" }}
				/>
				<Tabs.Screen
					name="complaint"
					options={{ title: "Complain" }}
				/>
			</Tabs>
		</>
	);
}

const styles = StyleSheet.create({
	tabBarBackground: {
		position: "absolute",
		bottom: 0,
		left: 10,
		right: 10,
		height: 90,
		backgroundColor: "#fff",
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		zIndex: 0,
		alignItems: "center",
	},
	curveCutout: {
		position: "absolute",
		top: -35,
		width: 80,
		height: 80,
		backgroundColor: "#fff",
		borderRadius: 40,
		zIndex: 1,
	},
	floatingButton: {
		position: "absolute",
		top: -35,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#003083",
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 5,
		borderColor: "#e0e0e0",
		zIndex: 2,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
	},
});
