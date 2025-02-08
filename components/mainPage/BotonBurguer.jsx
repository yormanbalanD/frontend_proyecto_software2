import React from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";

const BotonBurguer = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => {
          onPress();
        }}
      >
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
  line: {
    width: 30,
    height: 5,
    backgroundColor: "white",
    marginVertical: 2,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "black",
  },
});

export default BotonBurguer;
