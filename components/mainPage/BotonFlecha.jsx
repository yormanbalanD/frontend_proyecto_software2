import React from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import Icon from "@expo/vector-icons/Entypo";
import Colors from "@/constants/Colors";

const BotonBurguer = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          {
            ...styles.boton,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => {
          onPress();
        }}
      >
        <Icon name="chevron-thin-down" size={17} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    padding: 8,
    backgroundColor: Colors.whiteTransparent,
    borderRadius: 50,
  },
  container: {
    position: "absolute",
    top: 55,
    left: 30,
  },
});

export default BotonBurguer;
