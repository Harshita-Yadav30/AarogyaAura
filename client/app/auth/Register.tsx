import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState(""); // New: user's name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "patient" | "pharmacist">("patient");
  const [secret, setSecret] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleRegister = async () => {
    // Validate required fields
    if (!name || !email || !password) {
      return Alert.alert("All fields are required");
    }

    // Optional: verify secret key for doctor/pharmacist
    if ((role === "doctor" || role === "pharmacist") && secret !== "YOUR_SECRET_KEY") {
      return Alert.alert("Invalid Secret Key");
    }

    try {
      await axios.post("http://192.168.1.2:8000/api/auth/register/", {
        email,          // email is used as username
        password,
        role,
        name,           // sent as 'name' to store in first_name
        specialization: role === "doctor" ? specialization : undefined,
      });
      Alert.alert("Registered successfully", "Please login");
      router.replace("/auth/Login");
    } catch (err: any) {
      Alert.alert("Registration failed", err.response?.data?.detail || err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Register</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }}
        secureTextEntry
      />

      <Text style={{ marginBottom: 5 }}>Role</Text>
      {["patient", "doctor", "pharmacist"].map(r => (
        <TouchableOpacity
          key={r}
          onPress={() => setRole(r as any)}
          style={{
            padding: 10,
            backgroundColor: role === r ? "#4CAF50" : "#ccc",
            marginBottom: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: role === r ? "white" : "black" }}>{r}</Text>
        </TouchableOpacity>
      ))}

      {(role === "doctor" || role === "pharmacist") && (
        <TextInput
          placeholder="Secret Key"
          value={secret}
          onChangeText={setSecret}
          style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }}
        />
      )}

      {role === "doctor" && (
        <TextInput
          placeholder="Specialization (e.g., Cardiology)"
          value={specialization}
          onChangeText={setSpecialization}
          style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }}
        />
      )}

      <TouchableOpacity
        onPress={handleRegister}
        style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/Login")}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <Text>{`Already have an account? Login`}</Text>
      </TouchableOpacity>
    </View>
  );
}
