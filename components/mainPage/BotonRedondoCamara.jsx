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
          opacity: pressed ? 0.7 : 0.9,
        };
      }}
    >
      <View style={styles.circuloInterior} />
    </Pressable>
  );
}

const TAMAÑO_BOTON = 90;
const TAMAÑO_CENTRO_BOTON = TAMAÑO_BOTON - 15;

const styles = StyleSheet.create({
  container: {
    width: TAMAÑO_BOTON,
    height: TAMAÑO_BOTON,
    position: "absolute",
    bottom: 30,
    left: "50%",
    transform: [{ translateX: -(TAMAÑO_BOTON / 2) }],
    padding: 10,
    borderRadius: 90,
    borderColor: "#fff",
    borderWidth: 3,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circuloInterior: {
    height: TAMAÑO_CENTRO_BOTON,
    width: TAMAÑO_CENTRO_BOTON,
    backgroundColor: "#fff",
    borderRadius: 90,
  },
});
