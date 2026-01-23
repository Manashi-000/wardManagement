import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: "#fff",
          height: 90,
          position: "absolute",
          paddingBottom: 15,
          elevation: 10,
        },

        tabBarActiveTintColor: "#003083",
        tabBarInactiveTintColor: "#777",

        tabBarIcon: ({ color, focused }) => {
          let icon;
          let label;

          switch (route.name) {
            case "home":
              icon = focused ? "home" : "home-outline";
              label = "Home";
              break;
            case "post":
              icon = focused ? "document-text" : "document-text-outline";
              label = "Post";
              break;
            case "organizations":
              return null; 

            case "event":
              icon = focused ? "calendar" : "calendar-outline";
              label = "Event";
              break;

            case "complaint":
              icon = focused ? "chatbox-ellipses" : "chatbox-ellipses-outline";
              label = "Complaint";
              break;
          }

          return (
            <View style={{ alignItems: "center" }}>
              <Ionicons name={icon} size={22} color={color} />
              <Text style={{ fontSize: 9, color }}>{label}</Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="post" />

      {/* Floating Button */}
      <Tabs.Screen
        name="organizations"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} style={styles.floatingButton}>
              <MaterialCommunityIcons
                name="account-group"
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen name="event" />
      <Tabs.Screen name="complaint" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: -30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#003083",
    borderWidth: 5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
  },
});
