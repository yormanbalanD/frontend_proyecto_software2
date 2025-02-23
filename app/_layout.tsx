import React from "react";
import { View, Text } from "react-native";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import { useFonts } from "expo-font";
// import { StatusBar } from "react-native-web";

export default function _layout() {
  const [fontsLoaded] = useFonts({
    "League-Gothic": require("../assets/fonts/LeagueGothic-Regular.ttf"),
    "Open-Sans": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "Helios-Bold": require("../assets/fonts/HeliosExtC-Bold.ttf"),
  });
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
        <Stack.Screen name="historial" />
        <Stack.Screen name="megusta" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
