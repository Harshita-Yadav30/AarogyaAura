import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Orders() {
  const router = useRouter();

  const options = [
    { title: "View Order Status", route: "/pharmacist/orders/view", icon: "eye-outline", color: ["#34d399", "#059669"] },
    { title: "QR Scan for Prescription Orders", route: "/pharmacist/orders/scan", icon: "qr-code-outline", color: ["#a78bfa", "#6d28d9"] },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Order Management</Text>
      {options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => router.push(opt.route)}
          activeOpacity={0.85}
          style={styles.cardWrapper}
        >
          <LinearGradient colors={opt.color} style={styles.card}>
            <Ionicons name={opt.icon} size={30} color="white" style={{ marginBottom: 8 }} />
            <Text style={styles.cardText}>{opt.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  cardWrapper: { marginBottom: 15 },
  card: { padding: 20, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  cardText: { fontSize: 16, fontWeight: "600", color: "white", textAlign: "center" },
});
