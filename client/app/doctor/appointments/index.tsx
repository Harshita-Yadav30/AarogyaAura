import React, { useEffect, useState } from "react";
import { ScrollView, Text, Alert, View } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppointmentCard from "./AppointmentCard";
import { useRouter } from "expo-router";

export default function DoctorAppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const t = await AsyncStorage.getItem("accessToken");
      setToken(t);
      if (t) fetchAppointments(t);
    };
    loadData();
  }, []);

  const fetchAppointments = async (t: string | null) => {
    try {
      const res = await axios.get("http://192.168.1.2:8000/api/appointments/", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAppointments(res.data && res.data.length > 0 ? res.data : []);
    } catch (err) {
      console.log(err);
      setAppointments([]);
      Alert.alert("Failed to fetch appointments");
    }
  };

  const joinVideo = (appointmentId: number) => {
    // redirect doctor to same video room
    router.push(`/doctor/VideoCall?roomId=${appointmentId}`);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        My Appointments
      </Text>

      {appointments.length > 0 ? (
        appointments.map((appt, idx) => (
          <AppointmentCard
            key={appt.id || idx}
            appointment={appt}
            onJoinVideo={joinVideo}
            showPatientInfo={true}
            fetchAppointments={fetchAppointments}
          />
        ))
      ) : (
        <View style={{ marginTop: 20 }}>
          <Text>No appointments scheduled.</Text>
        </View>
      )}
    </ScrollView>
  );
}
