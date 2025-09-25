import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://192.168.1.2:8000/api/auth/login/", { username, password });
      const { access, refresh } = res.data;
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);
      console.log("Tokens stored")
      router.replace("/auth/AuthLoading");
    } catch (err: any) {
      Alert.alert("Login failed", err.response?.data?.detail || err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>
      <TextInput placeholder="Email" value={username} onChangeText={setUsername} style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={{ borderWidth: 1, borderRadius: 8, marginBottom: 10, padding: 10 }} secureTextEntry />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, alignItems: "center" }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/Register")}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <Text>{`Don't have an account? Register`}</Text>
      </TouchableOpacity>
    </View>
  );
}
