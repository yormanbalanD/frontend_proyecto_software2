import React from "react";
import { View, Text } from "react-native";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
// import { StatusBar } from "react-native-web";

export default function _layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="mainpage" />
        <Stack.Screen name="historial" options={{ headerShown: true, headerTitle: "Historial", headerTintColor: Colors.white, headerStyle: {
          backgroundColor: Colors.primary,
        } }} />
        <Stack.Screen name="megusta" options={{ headerShown: true, headerTitle: "Historial", headerTintColor: Colors.white, headerStyle: {
          backgroundColor: Colors.primary,
        } }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
