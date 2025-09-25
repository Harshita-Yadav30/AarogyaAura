import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

type AppointmentCardProps = {
  appointment: any;
  onJoinVideo?: (id: number) => void;
};

export default function AppointmentCard({ appointment, onJoinVideo }: AppointmentCardProps) {
  const isTele = appointment?.appointment_type === "tele";

  return (
    <View style={styles.card}>
      <Text style={styles.doctor}>
        👨‍⚕️ Doctor:{" "}
        {appointment.doctor
          ? appointment.doctor
          : appointment.doctor?.user?.username || "Unknown"}
      </Text>
      <Text style={styles.detail}>📋 Type: {appointment?.appointment_type || "N/A"}</Text>
      <Text style={styles.detail}>📌 Status: {appointment?.status || "N/A"}</Text>
      <Text style={styles.token}>🎟️ Token: {appointment?.token_number || "N/A"}</Text>
      <Text style={styles.token}>⏰ Time: {appointment?.appointment_time || "N/A"}</Text>

      {isTele && appointment.status === 'scheduled' && onJoinVideo && 
        <TouchableOpacity
          style={styles.videoButton}
          onPress={() => onJoinVideo(appointment?.id || 0)}
        >
          <Text style={styles.videoText}>Join Video Call</Text>
        </TouchableOpacity>
      }

      {appointment.prescription_pdf && (
        <TouchableOpacity
          onPress={async () => {
            try {
              const downloadUri = appointment.prescription_pdf;
              const fileUri = FileSystem.documentDirectory + `prescription_appointment_${appointment.id}.pdf`;

              // Download PDF
              const { uri } = await FileSystem.downloadAsync(downloadUri, fileUri);

              // Open/share the PDF
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
              } else {
                alert("File downloaded to: " + uri);
              }
            } catch (err) {
              console.error("PDF download error:", err);
            }
          }}
          style={styles.pdfButton}
        >
          <Text style={styles.pdfText}>Download Prescription PDF</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#908e8eff",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  doctor: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },
  detail: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  token: {
    marginTop: 8,
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
  },
  videoButton: {
    marginTop: 10,
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  videoText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
    pdfButton: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
