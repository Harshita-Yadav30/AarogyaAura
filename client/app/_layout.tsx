import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      {/* Initial screen checks if user is logged in */}
      <Stack.Screen name="auth/AuthLoading" options={{ headerShown: false }} />
      
      {/* Your main app pages */}
      <Stack.Screen name="doctor/index" options={{ headerShown: false }} />
      <Stack.Screen name="patient/index" options={{ headerShown: false }} />
      <Stack.Screen name="pharmacist/index" options={{ headerShown: false }} />
    </Stack>
  );
}
