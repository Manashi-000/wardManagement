import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const API_URL = Constants.expoConfig?.extra?.backendURL;
const screenWidth = Dimensions.get("window").width;

export default function WardActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState({});
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();
  const currentUserId = "user123"; // Replace with logged-in user id

  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").height)).current;

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/admins/get-posts`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch posts");
      setActivities(data.posts || []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // LIKE / UNLIKE
  const handleLikeToggle = async (postID) => {
    const postIndex = activities.findIndex((p) => p?.id === postID);
    if (postIndex === -1) return;

    const post = activities[postIndex];
    const likes = post?.likes || [];
    const liked = likes.includes(currentUserId);

    try {
      const res = await fetch(`${API_URL}/admins/like-post/${postID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      if (!res.ok) throw new Error(liked ? "Failed to unlike" : "Failed to like");

      const updatedPosts = [...activities];
      updatedPosts[postIndex].likes = liked
        ? likes.filter((id) => id !== currentUserId)
        : [...likes, currentUserId];

      setActivities(updatedPosts);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // ADD COMMENT
  const handleAddFeedback = async (postID) => {
    const comment = newFeedback[postID];
    if (!comment) return;

    try {
      const res = await fetch(`${API_URL}/admins/feedback-post/${postID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, comment }),
      });
      if (!res.ok) throw new Error("Failed to add feedback");

      setActivities((prev) =>
        prev.map((p) =>
          p?.id === postID
            ? { ...p, feedback: [...(p.feedback || []), { id: Date.now().toString(), userId: currentUserId, comment }] }
            : p
        )
      );

      setNewFeedback((prev) => ({ ...prev, [postID]: "" }));
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // UPDATE COMMENT
  const handleUpdateComment = async (postID, commentID) => {
    const newComment = prompt("Edit comment");
    if (!newComment) return;

    try {
      const res = await fetch(`${API_URL}/admins/update-comment/${postID}/${commentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, comment: newComment }),
      });
      if (!res.ok) throw new Error("Failed to update comment");

      setActivities((prev) =>
        prev.map((p) =>
          p.id === postID
            ? {
                ...p,
                feedback: p.feedback.map((c) => (c.id === commentID ? { ...c, comment: newComment } : c)),
              }
            : p
        )
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (postID, commentID) => {
    try {
      const res = await fetch(`${API_URL}/admins/delete-comment/${postID}/${commentID}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      if (!res.ok) throw new Error("Failed to delete comment");

      setActivities((prev) =>
        prev.map((p) =>
          p.id === postID ? { ...p, feedback: p.feedback.filter((c) => c.id !== commentID) } : p
        )
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const openComments = (postID) => {
    setActiveCommentsPost(postID);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeComments = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setActiveCommentsPost(null));
  };

  const renderSlider = (images) => (
    <View style={{ marginBottom: 10 }}>
      <FlatList
        data={images?.length ? images : ["https://via.placeholder.com/400"]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / (screenWidth - 30));
          setActiveImageIndex(index);
        }}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.sliderImage} resizeMode="cover" />}
      />
      {images?.length > 1 && (
        <View style={styles.sliderDots}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, { opacity: i === activeImageIndex ? 1 : 0.3 }]} />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Feather name="arrow-left" size={24} color="#003083" />
        </TouchableOpacity>
        <Text style={styles.header}>Ward Activities</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#003083" />
        ) : activities.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No activities found.</Text>
        ) : (
          activities.map((post, index) => {
            if (!post) return null;
            const likes = post.likes || [];
            const feedback = post.feedback || [];

            return (
              <View key={post.id}>
                {renderSlider(post.image)}
                <Text style={styles.postTopic}>{post.postname}</Text>
                <Text style={styles.postDesc}>{post.postDescription}</Text>
                <Text style={styles.postDate}>
                  📅 {new Date(post.createdAt).toLocaleDateString()}{" "}
                  {new Date(post.createdAt).toLocaleTimeString()}
                </Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleLikeToggle(post.id)}>
                    <AntDesign name={likes.includes(currentUserId) ? "like1" : "like2"} size={20} color="#003083" />
                    <Text style={styles.actionText}>{likes.length} Likes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={() => openComments(post.id)}>
                    <Ionicons name="chatbubble-outline" size={20} color="#003083" />
                    <Text style={styles.actionText}>{feedback.length} Comments</Text>
                  </TouchableOpacity>
                </View>

                {index < activities.length - 1 && <View style={styles.separatorLine} />}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* COMMENT MODAL */}
      {activeCommentsPost && (
        <Modal transparent animationType="fade" visible={true}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
              <TouchableOpacity style={styles.closeBtn} onPress={closeComments}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalHeader}>Comments</Text>

              <FlatList
                style={{ flex: 1, paddingHorizontal: 10 }}
                data={activities.find((p) => p.id === activeCommentsPost)?.feedback || []}
                renderItem={({ item }) => (
                  <View
                    style={{
                      alignSelf: item.userId === currentUserId ? "flex-end" : "flex-start",
                      backgroundColor: item.userId === currentUserId ? "#DDEEFF" : "#F0F0F0",
                      padding: 10,
                      borderRadius: 12,
                      marginBottom: 8,
                      maxWidth: "80%",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 12, marginBottom: 2, color: "#003083" }}>
                      {item.userId}
                    </Text>
                    <Text style={{ fontSize: 14 }}>{item.comment}</Text>

                    {item.userId === currentUserId && (
                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <TouchableOpacity
                          onPress={() => handleUpdateComment(activeCommentsPost, item.id)}
                          style={{ marginRight: 10 }}
                        >
                          <Text style={{ color: "blue" }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteComment(activeCommentsPost, item.id)}>
                          <Text style={{ color: "red" }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />

              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.commentInputRow}>
                  <TextInput
                    placeholder="Write a comment..."
                    value={newFeedback[activeCommentsPost] || ""}
                    onChangeText={(text) =>
                      setNewFeedback((prev) => ({ ...prev, [activeCommentsPost]: text }))
                    }
                    style={styles.inputBox}
                    multiline
                  />
                  <TouchableOpacity style={styles.sendBtn} onPress={() => handleAddFeedback(activeCommentsPost)}>
                    <Text style={{ color: "#fff" }}>Send</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 35, backgroundColor: "#d9e6ff" },
  header: { fontSize: 22, fontWeight: "bold", color: "#003083" },
  sliderImage: { width: screenWidth - 30, height: screenWidth - 80, borderRadius: 15, marginHorizontal: 15 },
  sliderDots: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#003083", marginHorizontal: 3 },
  postTopic: { fontSize: 20, fontWeight: "bold", color: "#003083", marginHorizontal: 15, marginBottom: 8 },
  postDesc: { fontSize: 16, color: "#555", marginHorizontal: 15 },
  postDate: { fontSize: 12, marginHorizontal: 15, marginTop: 5, color: "gray" },
  actionsRow: { flexDirection: "row", marginHorizontal: 15, marginTop: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 5, color: "#003083", fontWeight: "bold" },
  separatorLine: { height: 1, backgroundColor: "#aac7ff", marginVertical: 20, marginHorizontal: 15 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalContainer: { position: "absolute", bottom: 0, height: "90%", width: "100%", backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 50 },
  closeBtn: { position: "absolute", top: 10, right: 15 },
  closeText: { fontSize: 22, fontWeight: "bold", color: "#003083" },
  modalHeader: { fontSize: 22, color: "#003083", fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  commentInputRow: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd" },
  inputBox: { flex: 1, backgroundColor: "#edf3ff", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10 },
  sendBtn: { backgroundColor: "#003083", marginLeft: 10, padding: 12, borderRadius: 20 },
});
