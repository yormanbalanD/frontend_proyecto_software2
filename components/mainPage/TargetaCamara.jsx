import Colors from "@/constants/Colors";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

export default function TargetaCamara({ restaurante }) {
  useEffect(() => {
    console.log("restaurante", restaurante);
  }, [restaurante]);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.white,
    width: 100,
    height: 100,
  },
});
