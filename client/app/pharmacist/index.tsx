import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // for icons
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const router = useRouter();

  const sections = [
    { title: "Inventory", route: "/pharmacist/inventory", icon: "cube-outline", color: ["#34d399", "#059669"] },
    { title: "Emergency", phoneNumber: "+911234567890", icon: "alert-circle-outline", color: ["#f87171", "#b91c1c"] },
    { title: "Profile", route: "/profile", icon: "person-circle-outline", color: ["#60a5fa", "#2563eb"] },
    { title: "Manage Orders", route: "/pharmacist/orders", icon: "cart-outline", color: ["#a78bfa", "#6d28d9"] },
  ];

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    Alert.alert("Logged Out", "You have been logged out.");
    router.replace("/auth/Login");
  };

  return (
    <LinearGradient colors={["#ecfdf5", "#d1fae5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>🌿 AarogyaAura</Text>
        <Text style={styles.subHeader}>Your health, just a tap away</Text>

        <View style={styles.grid}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (section.phoneNumber) {
                  Linking.openURL(`tel:${section.phoneNumber}`).catch(() =>
                    Alert.alert("Error", "Cannot open phone dialer")
                  );
                } else if (section.route) {
                  router.push(section.route);
                }
              }}
              activeOpacity={0.85}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={section.color}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={section.icon} size={40} color="white" style={styles.icon} />
                <Text style={styles.cardText}>{section.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#f44336" }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#065f46",
    marginTop: 32,
    marginBottom: 6,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 30,
    textAlign: "center",
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
