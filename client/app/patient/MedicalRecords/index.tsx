import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Record {
  id: number;
  title: string;
  doctor_name: string;
  date: string;
  prescription_pdf: string | null;
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRecords = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await axios.get("http://192.168.1.2:8000/api/appointments/records/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to fetch medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openPDF = (url: string | null) => {
    if (!url) {
      Alert.alert("No File", "Prescription PDF not available.");
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert("Error", "Cannot open PDF."));
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#059669" />
        <Text>Loading records...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📄 Medical Records</Text>
      {records.length === 0 ? (
        <Text style={styles.noRecords}>No records found.</Text>
      ) : (
        records.map((record) => (
          <View key={record.id} style={styles.card}>
            <Text style={styles.title}>{record.title}</Text>
            <Text style={styles.detail}>Doctor: {record.doctor_name}</Text>
            <Text style={styles.detail}>Date: {new Date(record.date).toLocaleDateString()}</Text>
            {record.prescription_pdf && (
              <TouchableOpacity style={styles.button} onPress={() => openPDF(record.prescription_pdf)}>
                <Text style={styles.buttonText}>View Prescription</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  noRecords: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#374151",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#059669",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
