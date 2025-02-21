import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import Icon from "@expo/vector-icons/Entypo";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";

export default function Perfil() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        gap: 8,
      }}
    >
      {/* <View
        style={{
          width: "100%",
          height: "100%",

          flex: 1,
        }}
      > */}
      <Image
        source={require("@/assets/images/tomar foto.png")}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#e5d0ac",
          position: "absolute",
          opacity: 0.75,
        }}
      />
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
          <Icon
            name="chevron-thin-down"
            size={17}
            style={{
              transform: [{ rotate: "90deg" }],
            }}
            color="white"
          />
        </Pressable>
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.containerFotoPerfil}>
          <Image
            source={require("@/assets/images/avatarPrueba.png")}
            style={styles.fotoPerfil}
          />
        </View>
        {/* Nombre */}
        <Text style={{ textAlign: "center", fontWeight: 700, fontSize: 23 }}>
          Saray Hernandez
        </Text>

        {/* Codigo */}
        <Text
          style={{
            textAlign: "center",
            fontSize: 15,
            letterSpacing: 2,
            fontWeight: 600,
            marginBottom: 25,
          }}
        >
          12312123
        </Text>
      </View>

      <TextInput placeholder="Correo" style={styles.input} />
      <TextInput placeholder="Nombre" style={styles.input} />
      <TextInput placeholder="Contraseña" style={styles.input} />

      <View
        style={{
          position: "absolute",
          bottom: 15,
          width: "100%",
          flex: 1,
          alignItems: "center"
        }}
      >
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
          <Icon
            name="chevron-thin-down"
            size={20}
            style={{
              transform: [{ rotate: "180deg" }],
            }}
            color="red"
          />
        </Pressable>
      </View>
    </View>
  );
}

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
  input: {
    width: "80%",
    fontSize: 15,
    paddingTop: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    paddingRight: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#ea7060",
    borderWidth: 1,
    textAlign: "center",
  },
  containerFotoPerfil: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ea7060",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
});
