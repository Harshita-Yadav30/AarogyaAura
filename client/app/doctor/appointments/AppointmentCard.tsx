import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface AppointmentCardProps {
  appointment: any;
  onJoinVideo?: (appointmentId: number) => void;
  showPatientInfo?: boolean; // for doctor dashboard
  fetchAppointments?: (t: string | null) => void;
}

export default function AppointmentCard({
  appointment,
  onJoinVideo,
  showPatientInfo = false,
  fetchAppointments
}: AppointmentCardProps) {
  const {
    id,
    appointment_type,
    status,
    token_number,
    doctor_info,
    patient_info,
    emergency,
    scheduled_at,
  } = appointment;

  const handlePrescribe = async (appointmentId: number) => {
    const t = await AsyncStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        `http://192.168.1.2:8000/api/appointments/${appointmentId}/prescribe/`,
        {
          medicines: ["Paracetamol 500mg", "Vitamin C 1000mg"],
          notes: "Take medicines after meals",
        },
        { headers: { Authorization: `Bearer ${t}` }, responseType: "blob" }
      );

      Alert.alert("Success", "Prescription added. Patient marked as treated!");

      if (fetchAppointments){
        fetchAppointments(t);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to generate prescription PDF");
    }
  };

  return (
    <View style={[styles.card, emergency && styles.emergencyCard]}>
      <Text style={styles.text}>
        {appointment_type === "offline" ? "Offline" : "Tele"} Appointment
      </Text>

      {showPatientInfo ? (
        <Text style={styles.text}>
          Patient: {patient_info?.first_name || patient_info?.username}
        </Text>
      ) : (
        <Text style={styles.text}>
          Doctor: {doctor_info?.first_name || doctor_info?.username} (
          {doctor_info?.specialization || "General"})
        </Text>
      )}

      {token_number && (
        <Text style={styles.text}>Token Number: {token_number}</Text>
      )}
      <Text style={styles.text}>⏰ Time: {appointment?.appointment_time || "N/A"}</Text>

      <Text style={styles.text}>Status: {status}</Text>
      {scheduled_at && <Text style={styles.text}>Time: {new Date(scheduled_at).toLocaleString()}</Text>}

      {appointment_type === "tele" && appointment.status === "scheduled" && onJoinVideo && (
        <TouchableOpacity
          onPress={() => onJoinVideo(id)}
          style={styles.videoButton}
        >
          <Text style={styles.videoButtonText}>Join Video Call</Text>
        </TouchableOpacity>
      )}

      {emergency && <Text style={styles.emergencyText}>⚠️ Emergency</Text>}

      {showPatientInfo && appointment.status === "scheduled" && (
        <TouchableOpacity
          onPress={() => handlePrescribe(appointment.id)}
          style={styles.prescribeButton}
        >
          <Text style={styles.prescribeButtonText}>Prescribe Medicine</Text>
        </TouchableOpacity>
      )}

      {appointment.status === "treated" && (
        <Text style={[styles.text, { color: "#059669", fontWeight: "600" }]}>
          ✅ Treated
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  emergencyCard: {
    borderColor: "#ff4d4d",
    backgroundColor: "#ffe5e5",
  },
  text: {
    marginBottom: 5,
  },
  videoButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  videoButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emergencyText: {
    marginTop: 5,
    color: "#ff0000",
    fontWeight: "bold",
  },
  prescribeButton: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  prescribeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
