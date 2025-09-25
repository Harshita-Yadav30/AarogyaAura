import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {jwtDecode} from "jwt-decode";

export default function AuthLoading() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded: any = jwtDecode(token); // decode JWT to get user role
          const role = decoded.role;
          if (role === "doctor") router.replace("/doctor");
          else if (role === "patient") router.replace("/patient");
          else if (role === "pharmacist") router.replace("/pharmacist");
          else router.replace("/auth/Login");
        } catch {
          router.replace("/auth/Login");
        }
      } else {
        router.replace("/auth/Login");
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}
