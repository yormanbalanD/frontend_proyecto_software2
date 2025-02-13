import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function BotonRedondoCamara({ tomarFoto }) {
  return (
    <Pressable
      onPress={() => {
        tomarFoto();
      }}
      style={({ pressed }) => {
        return {
          ...styles.container,
          opacity: pressed ? 0.7 : 0.8,
        };
      }}
    >
      <View style={styles.circuloInterior} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 30,
    left: "50%",
    transform: [{ translateX: -50 }],
    padding: 10,
    borderRadius: 90,
    borderColor: "#fff",
    borderWidth: 3,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circuloInterior: {
    height: 85,
    width: 85,
    backgroundColor: "#fff",
    borderRadius: 90,
  },
});
