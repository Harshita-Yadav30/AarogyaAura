import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

export default function VideoCallScreen() {
  const params = useLocalSearchParams<{ roomId: string }>();
  const roomId = params.roomId;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: `https://meet.jit.si/${roomId}?config.overwrite={"startWithVideoMuted":true,"startWithAudioMuted":false}`,
        }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}