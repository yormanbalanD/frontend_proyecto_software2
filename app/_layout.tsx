import React from "react";
import { View, Text } from "react-native";
import { Slot, Stack } from "expo-router";
// import { StatusBar } from "react-native-web";

export default function _layout() {
  return (
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //   <StatusBar style="auto" />
    <Stack
    screenOptions={{
      headerShown: false,
    }}
    >

      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
    // </View>
  );
}
