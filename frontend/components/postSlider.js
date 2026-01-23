import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const API_URL = Constants.expoConfig?.extra?.backendURL;
const screenWidth = Dimensions.get("window").width;

export default function PostSlider() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/admins/get-posts?limit=3`);
      const data = await res.json();
      setPosts(data?.posts || []);
    } catch (error) {
      console.log("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#003083" style={{ marginTop: 10 }} />;

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.heading}>Recent Posts</Text>
      
      <FlatList
        data={[...posts, { seeMore: true }]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ alignItems: "center", paddingHorizontal: 8 }}
        renderItem={({ item }) =>
          item.seeMore ? (
            <TouchableOpacity 
              style={[styles.seeMoreCard, { justifyContent: "center" }]} 
              onPress={() => router.push("/(tabs)/post")}
            >
              <Text style={styles.seeMoreText}>See More →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/(tabs)/post?id=${item.id}`)}>
              <Image
                source={{ uri: item.image?.[0] || "https://via.placeholder.com/400" }}
                style={styles.image}
              />
              <Text numberOfLines={1} style={styles.title}>{item.postname}</Text>
              <View style={styles.dateRow}>
                <Feather name="calendar" size={12} color="gray" style={{ marginRight: 4 }} />
                <Text style={styles.date}>
                  {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003083",
    marginLeft: 15,
    marginBottom: 5,
  },

  card: {
    width: screenWidth * 0.55,
    backgroundColor: "#fff",
    marginHorizontal: 8, 
    padding: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
    color: "#003083",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  date: {
    fontSize: 11,
    color: "gray",
  },

  seeMoreCard: {
    width: screenWidth * 0.35,
    height: 120,
    backgroundColor: "#d9e6ff",
    marginHorizontal: 8,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  seeMoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#003083",
  },
});
