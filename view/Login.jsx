import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Image } from "expo-image";
import { Link, router, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import BotonLogin from "@/components/BotonLogin";

import Entypo from "@expo/vector-icons/Entypo";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  textButton: {
    textAlign: "center",
    color: Colors.primary,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 600,
    width: "70px",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 25,
    width: "75%",
  },
  textInput: {
    backgroundColor: Colors.white,
    width: "100%",
    height: 35,
    borderRadius: 4,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default function Login() {
  const navigate = useRouter();
  const [verContraseña, setVerContraseña] = React.useState(false);

  return (
    <View
      style={{
        backgroundColor: Colors.primary,
        height: "100%",
        flex: 1,
        width: "100%",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 150,
        }}
      >
        {/* Logo De La APP */}
        <Image
          source={require("@/assets/images/logo.jpg")}
          style={{ width: "70%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <View style={styles.container}>
        <View
          style={{ flexDirection: "column", gap: 15, flex: 1, width: "100%" }}
        >
          <TextInput
            placeholderTextColor={"#acacac"}
            style={styles.textInput}
            placeholder="usuario o correo"
          />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholderTextColor={"#acacac"}
              style={{ ...styles.textInput, paddingRight: 40 }}
              placeholder="contraseña"
              secureTextEntry={!verContraseña}
            />
            {verContraseña ? (
              <Pressable
                onPress={() => setVerContraseña(false)}
                style={{ position: "absolute", right: 10 }}
              >
                <Entypo name="eye-with-line" size={24} color="black" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setVerContraseña(true)}
                style={{ position: "absolute", right: 10 }}
              >
                <Entypo name="eye" size={24} color="black" />
              </Pressable>
            )}
          </View>
          <View style={{ paddingRight: 15 }}>
            <Link
              style={{
                fontSize: 11,
                color: Colors.white,
                textDecorationLine: "underline",
                textAlign: "right",
              }}
              href={"/"}
            >
              Olvidaste Tu Contraseña?
            </Link>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 25,
            width: "100%",
          }}
        >
          <Pressable
            onPress={() => router.push("/")}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? Colors.lightGray : Colors.white,
              },
            ]}
          >
            <Text style={styles.textButton}>Volver</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? Colors.lightGray : Colors.white,
              },
            ]}
          >
            <Text style={styles.textButton}>Aceptar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
