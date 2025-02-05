import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link, router, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import BotonLogin from "@/components/BotonLogin";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 13,
    paddingBottom: 13,
    width: "100%",
  },
  textButton: {
    textAlign: "center",
    color: Colors.primary,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 600,
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 25,
    width: "60%",
  },
});

export default function Login() {
  const navigate = useRouter();
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
        <Pressable
          onPress={() => router.push("login")}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? Colors.lightGray : Colors.white,
            },
          ]}
        >
          <Text style={styles.textButton}>INICIAR SESION</Text>
        </Pressable>
        <Pressable
        onPress={() => router.push("signup")}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? Colors.lightGray : Colors.white,
            },
          ]}
        >
          <Text style={styles.textButton}>REGISTRARSE</Text>
        </Pressable>
      </View>
    </View>
  );
}
