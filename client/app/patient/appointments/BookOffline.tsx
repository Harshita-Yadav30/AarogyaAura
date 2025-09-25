import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type BookOfflineProps = {
  doctors: any[];
  onBook: (doctorId: number, mode: "offline" | "tele") => void;
};

export default function BookOffline({ doctors, onBook }: BookOfflineProps) {
  const [mode, setMode] = useState<"offline" | "tele">("offline"); // default mode

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🩺 Book Appointment</Text>

      {/* Mode Selector */}
      <Text style={{ marginBottom: 5, fontWeight: "600" }}>Select Mode:</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["offline", "tele"].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m as "offline" | "tele")}
            style={{
              padding: 10,
              backgroundColor: mode === m ? "#10B981" : "#ccc",
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text style={{ color: mode === m ? "white" : "black", fontWeight: "600" }}>
              {m.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(!doctors || doctors.length === 0) && <Text>No Doctors available</Text>}

      {doctors.map((doc, index) => (
        <TouchableOpacity
          key={doc?.id || index}
          style={styles.button}
          onPress={() => onBook(doc?.id, mode)} // pass selected mode
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {doc?.name || "Unknown"} ({doc?.specialization || "General"})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    marginTop: 25,
    borderTopColor: "#000",
    borderTopWidth: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#065F46",
  },
  button: {
    padding: 14,
    backgroundColor: "#10B981",
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
