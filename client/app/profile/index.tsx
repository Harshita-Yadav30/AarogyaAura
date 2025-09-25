import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface UserProfile {
  id: number;
  username: string;
  name: string;
  role: string;
  specialization?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await axios.get("http://192.168.1.2:8000/api/auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to fetch profile info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#059669" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.profileHeading}>My Profile</Text>
      <View style={styles.profileCard}>
        <Text style={styles.name}>
          {user.name}
        </Text>
        <Text style={styles.detail}>Email: {user.username}</Text>
        <Text style={styles.detail}>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
        {user.role === "doctor" && (
          <Text style={styles.detail}>Specialization: {user.specialization || "General"}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "flex-start",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#374151",
  },
  profileHeading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 20,
    alignSelf: "center",
  },
});
