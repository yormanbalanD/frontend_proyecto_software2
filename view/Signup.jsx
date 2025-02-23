import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Image, ImageBackground } from "expo-image";
import { Link, router, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import BotonLogin from "@/components/BotonLogin";

import Entypo from "@expo/vector-icons/Entypo";

const styles = StyleSheet.create({
  titulo: {
    color: Colors.white,
    fontFamily: "HeliosExt-Regular",
    fontSize: 26,
  },
  button: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.6)",
  },
  textButton: {
    fontFamily: "Open-sans",
    textAlign: "center",
    color: Colors.primary,
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 600,
    width: 70,
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 35,
    paddingVertical: 30,
    paddingHorizontal: 30,
    width: "75%",
    backgroundColor: "rgba(0,0,0, 0.6)"
  },
  textInput: {
    fontFamily: "Open-sans",
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    color: Colors.white
  },
});

export default function Signup() {
  const navigate = useRouter();

  //Handle verPassword
  const [verPassword, setVerPassword] = React.useState(false);
  const [verConfirmarPassword, setVerConfirmarPassword] = React.useState(false);

  //Handle onfocus
  const [nombreFocused, setNombreFocused] = React.useState(false);
  const [correoFocused, setCorreoFocused] = React.useState(false);
  const [PasswordFocused, setPasswordFocused] = React.useState(false);
  const [confirmarPasswordFocused, setConfirmarPasswordFocused] = React.useState(false);

  const Signup = () => {
    navigate.push('mainpage');
  }

  return (
    <ImageBackground //Main page
      source={require("@/assets/images/registrarse (2).png")}
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",        
      }}
    >
      <View // Logo Container
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
          width: "80%",
        }}
      >
        {/* Logo De La APP */}
        <Image
          source={require("@/assets/images/logo_recortado.png")}
          style={{
            height: 80,
            width: 60,}}
          contentFit="contain"
        />
        <Text
          style={{
            fontSize: 60,
            color: "#FFF",
            fontFamily: "League-Gothic",
            width: "auto"}}
          >FOODIGO</Text>
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text style={styles.titulo}>
            Registrarse
          </Text>            
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, 
              nombreFocused && {outline: "none"}
            ]}
            placeholder="Nombre Del Usuario"
            onFocus={()=> setNombreFocused(true)}
            onBlur={()=> setNombreFocused(false)}
          />
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, 
              correoFocused && {outline: "none"}
            ]}
            placeholder="Correo"
            onFocus={()=> setCorreoFocused(true)}
            onBlur={()=> setCorreoFocused(false)}
          />
          <View
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholderTextColor={"#acacac"}
              style={[styles.textInput, 
                {paddingRight: 40},
                PasswordFocused && {outline: "none"}
              ]}
              placeholder="Contraseña"
              secureTextEntry={!verPassword}
              onFocus={()=> setPasswordFocused(true)}
              onBlur={()=> setPasswordFocused(false)}
            />
            {verPassword ? (
              <Pressable
                onPress={() => setVerPassword(false)}
                style={{ position: "absolute", right: 10 }}
              >
                <Entypo name="eye-with-line" size={24} color="#fff" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setVerPassword(true)}
                style={{ position: "absolute", right: 10 }}
              >
                <Entypo name="eye" size={24} color="#fff" />
              </Pressable>
            )}
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholderTextColor={"#acacac"}
              style={[styles.textInput, 
                {paddingRight: 40},
                confirmarPasswordFocused && {outline: "none"}
               ]}
              placeholder="Confirmar Contraseña"             
              secureTextEntry={!verConfirmarPassword}
              onFocus={()=> setConfirmarPasswordFocused(true)}
              onBlur={()=> setConfirmarPasswordFocused(false)}
            />
            {verConfirmarPassword ? (
              <Pressable
                onPress={() => setVerConfirmarPassword(false)}
                style={{ position: "absolute", right: 10,}}
              >
                <Entypo name="eye-with-line" size={24} color="#fff" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setVerConfirmarPassword(true)}
                style={{ position: "absolute", right: 10 }}
              >
                <Entypo name="eye" size={24} color="#fff" />
              </Pressable>
            )}
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/")}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? Colors.lightGray : Colors.white,
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            },
          ]}
        >
          <Text style={styles.textButton}>Subir foto</Text>
          <Entypo name="camera" size={24} color="#000" style={{paddingLeft: 5}}/>
        </Pressable>

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
            onPress={() => Signup()}
          >
            <Text style={styles.textButton}>Aceptar</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}
