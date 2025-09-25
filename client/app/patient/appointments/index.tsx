import React, { useEffect, useState } from "react";
import { ScrollView, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AppointmentCard from "./AppointmentCard";
import BookOffline from "./BookOffline";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppointmentsScreen() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const t = await AsyncStorage.getItem("accessToken");
      fetchDoctors(t);
      fetchAppointments(t);
    };
    loadData();
  }, []);

  const fetchDoctors = async (t: string | null) => {
    console.log(t);
    try {
      const res = await axios.get("http://192.168.1.2:8000/api/doctors/", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setDoctors(res.data || []);
    } catch {
      setDoctors([]);
    }
  };

  const fetchAppointments = async (t: string | null) => {
    try {
      const res = await axios.get("http://192.168.1.2:8000/api/appointments/", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAppointments(res.data || []);
    } catch {
      setAppointments([]);
    }
  };

  // Updated to accept mode ("offline" or "tele")
  const bookAppointment = async (doctorId: number, mode: "offline" | "tele") => {
    const t = await AsyncStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        "http://192.168.1.2:8000/api/appointments/book_offline/",
        {
          doctor: doctorId,
          appointment_type: mode, // use selected mode
          scheduled_at: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${t}` },
        }
      );
      Alert.alert("Appointment Booked", mode === "offline"
        ? `Token: ${res.data.token_number}`
        : "Tele appointment booked successfully");
      fetchAppointments(t);
    } catch (err) {
      console.log(err);
      Alert.alert("Appointment Booking Failed", `Doctor ID: ${doctorId}, Mode: ${mode}`);
    }
  };

  const startVideo = async (appointmentId: number) => {
    router.push(`/patient/VideoCall?roomId=${appointmentId}`);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Appointments</Text>

      {appointments.length > 0 ? (
        appointments.map((item, index) => (
          <AppointmentCard key={item.id || index} appointment={item} onJoinVideo={startVideo} />
        ))
      ) : (
        <Text>No Appointments</Text>
      )}

      <BookOffline doctors={doctors} onBook={bookAppointment} />
    </ScrollView>
  );
}
