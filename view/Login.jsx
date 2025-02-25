import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
} from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { useCookies } from "react-cookie";
import ModalNotificacion from "@/components/ModalNotificacion";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8c0e03",
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    color: Colors.white,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Heebo",
  },
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "column",
    alignItems: "center",
    gap: 25,
    padding: 30,
    width: "75%",
  },
  textInput: {
    color: Colors.white,
    backgroundColor: "transparent",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    fontFamily: "Open Sans",
    outline: "none",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    fontFamily: "Heebo",
    textAlign: "left",
    width: "100%",
  },
  logoText: {
    fontSize: 50,
    fontWeight: "bold",
    color: Colors.white,
    fontFamily: "League Gothic",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoImage: {
    height: 80,
    width: 60,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export default function Login() {
  const navigate = useRouter();
  const [verContraseña, setVerContraseña] = React.useState(false);
  const [correoFocused, setCorreoFocused] = React.useState(false);
  const [PasswordFocused, setPasswordFocused] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [cookies, setCookie] = useCookies(["token"]);

  const iniciarSesion = async () => {
    const response = await fetch("https://backend-swii.vercel.app/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: "abrahan@gmail.com", //email,
        password: "123456", //password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log({
      email: email,
      password: password,
    });

    console.log(response);

    if (response.status === 200) {
      const data = await response.json();
      setCookie("token", data.token);
      console.log(data);
    }
  };

  useEffect(() => {
    console.log(email);
  }, [email]);

  return (
    <ImageBackground
      source={require("@/assets/images/iniciar sesion (2).png")}
      style={styles.backgroundImage}
    >
      <View
        style={{
          height: "100%",
          flex: 1,
          width: "100%",
          gap: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo_recortado.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
          <Text style={styles.logoText}>FOODIGO</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>INICIAR SESIÓN</Text>
          <View style={{ flexDirection: "column", gap: 15, width: "100%" }}>
            <TextInput
              placeholderTextColor={"#acacac"}
              style={[styles.textInput, correoFocused && { outline: "none" }]}
              placeholder="Correo electrónico"
              onFocus={() => {
                setCorreoFocused(true);
              }}
              onBlur={() => {
                setCorreoFocused(false);
              }}
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
            <View
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholderTextColor={"#acacac"}
                style={[
                  styles.textInput,
                  { paddingRight: 40 },
                  PasswordFocused && { outline: "none" },
                ]}
                placeholder="Contraseña"
                onFocus={() => {
                  setPasswordFocused(true);
                }}
                onBlur={() => {
                  setPasswordFocused(false);
                }}
                secureTextEntry={!verContraseña}
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
              {verContraseña ? (
                <Pressable
                  onPress={() => setVerContraseña(false)}
                  style={{ position: "absolute", right: 10 }}
                >
                  <Entypo name="eye-with-line" size={24} color="white" />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => setVerContraseña(true)}
                  style={{ position: "absolute", right: 10 }}
                >
                  <Entypo name="eye" size={24} color="white" />
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
                ¿Olvidaste tu contraseña?
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
              onPress={() => {
                navigate.push("/");
              }}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? Colors.lightGray : "#8c0e03",
                },
              ]}
            >
              <Text style={styles.textButton}>VOLVER</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? Colors.lightGray : "#8c0e03",
                },
              ]}
              onPress={() => iniciarSesion()}
            >
              <Text style={styles.textButton}>SIGUIENTE</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <ModalNotificacion
        {...{
          isVisible: true,
          isSuccess: true,
          message: "Usuario creado correctamente.",
          onClose: () => {
            setModalVisible(false);
            navigate.push("/mainpage");
          },
        }}
      />
    </ImageBackground>
  );
}
