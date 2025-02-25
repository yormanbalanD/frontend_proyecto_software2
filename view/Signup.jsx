import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ImageBackground } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
<<<<<<< HEAD

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
    backgroundColor: "rgba(0,0,0, 0.6)",
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
    color: Colors.white,
  },
});
=======
import Notificacion from "@/components/ModalNotificacion";
import { useFetch } from "../utils/fetch/useFetch"; // Asegúrate de usar la importación con llaves
import endpoints from "../utils/fetch/endpoints-importantes.json";
>>>>>>> develop

export default function Signup() {
  const router = useRouter();

  //Handle verPassword
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmarPassword, setVerConfirmarPassword] = useState(false);

  //Handle onfocus
<<<<<<< HEAD
  const [nombreFocused, setNombreFocused] = React.useState(false);
  const [correoFocused, setCorreoFocused] = React.useState(false);
  const [PasswordFocused, setPasswordFocused] = React.useState(false);
  const [confirmarPasswordFocused, setConfirmarPasswordFocused] =
    React.useState(false);

  const Signup = async () => {
    const res = await fetch("https://backend-swii.vercel.app/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": "Yorman",
        "email": "yormna@gmail.com",
        "password": "12345678",
      }),
      mode: "cors",
    });

    if(res.status !== 200) {
      return;
    }

    console.log(await res.json());
    return;
    navigate.push("mainpage");
  };
=======
  const [nombreFocused, setNombreFocused] = useState(false);
  const [correoFocused, setCorreoFocused] = useState(false);
  const [PasswordFocused, setPasswordFocused] = useState(false);
  const [confirmarPasswordFocused, setConfirmarPasswordFocused] = useState(false);

  // Estados para el formulario y userData
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    fotoPerfil: "",
    description: "",
    typo: "",
  });

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal
  const [modalSuccess, setModalSuccess] = useState(false); // Éxito del modal

  const { data, loading, error, fetchData } = useFetch();
  const { data: emailValidationData, loading: emailValidationLoading, error: emailValidationError, fetchData: validateEmail } = useFetch();

  const validarFormulario = async () => {
    if (!userData.name) {
      setModalMessage("El nombre de usuario es obligatorio.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
  
    if (userData.name.length < 3) {
      setModalMessage("El nombre de usuario debe tener al menos 3 caracteres.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
  
    if (!userData.email) {
      setModalMessage("El correo electrónico es obligatorio.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
  
    // Validación de formato de correo electrónico (usando una expresión regular)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setModalMessage("El correo electrónico no tiene un formato válido.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    if (userData.email.length > 50) {
      setModalMessage("El correo electrónico debe tener menos de 50 caracteres.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    const emailValidationUrl = `https://emailverification.whoisxmlapi.com/api/v3?apiKey=at_iFCVm77T67rg3vK28nnSUdCUNkpwW&emailAddress=${userData.email}`;
    const emailValidationOptions = { method: 'GET', headers: { accept: 'application/json' } };

    await validateEmail(emailValidationUrl, emailValidationOptions); // Llama a useFetch

    if (emailValidationError) {
      setModalMessage("Error al validar el correo electrónico: " + (emailValidationError.message || "Error desconocido"));
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    if (emailValidationData && emailValidationData.smtpCheck !== "true") {
      setModalMessage("El correo electrónico no existe o no es válido.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    if (!userData.password) {
      setModalMessage("La contraseña es obligatoria.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
  
    // Validación de longitud mínima de contraseña
    if (userData.password.length < 4) {
      setModalMessage("La contraseña debe tener al menos 4 caracteres.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    if (userData.password.length > 15) {
      setModalMessage("La contraseña debe tener menos de 15 caracteres.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
  
    if (userData.password !== userData.confirmPassword) {
      setModalMessage("Las contraseñas no coinciden.");
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
    return true;
  }

  const handleSignup = async () => {
    if (!await validarFormulario()) {
      return;
    }    

    await fetchData(
      "https://backend-swii.vercel.app/api/createUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
  };

  useEffect(() => {
    if (loading) return;

    if (error) {
      setModalMessage(error.message || "Error al crear usuario.");
      setModalSuccess(false);
      setModalVisible(true);
    } else if (data) {
      setModalMessage("Usuario creado correctamente.");
      setModalSuccess(true);
      setModalVisible(true);
      setUserData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        fotoPerfil: "",
        description: "",
        typo: "",
      });
    }
  }, [loading, error, data]);

  const Signup = () => {
    router.push('mainpage');
  }
>>>>>>> develop

  const closeModal = () => {
    setModalVisible(false);
    if (modalSuccess) {
      Signup();
    }
  };

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
            width: 60,
          }}
          contentFit="contain"
        />
        <Text
          style={{
            fontSize: 60,
            color: "#FFF",
            fontFamily: "League-Gothic",
            width: "auto",
          }}
        >
          FOODIGO
        </Text>
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text style={styles.titulo}>Registrarse</Text>
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, nombreFocused && { outline: "none" }]}
            placeholder="Nombre Del Usuario"
<<<<<<< HEAD
            onFocus={() => setNombreFocused(true)}
            onBlur={() => setNombreFocused(false)}
          />
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, correoFocused && { outline: "none" }]}
            placeholder="Correo"
            onFocus={() => setCorreoFocused(true)}
            onBlur={() => setCorreoFocused(false)}
=======
            value={userData.name}
            onFocus={()=> setNombreFocused(true)}
            onBlur={()=> setNombreFocused(false)}
            onChangeText={(value) => handleInputChange("name", value)}
            maxLength={20}
          />
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, 
              correoFocused && {outline: "none"}
            ]}
            value={userData.email}
            placeholder="Correo"
            onFocus={()=> setCorreoFocused(true)}
            onBlur={()=> setCorreoFocused(false)}
            onChangeText={(value) => handleInputChange("email", value)}
            maxLength={20}
>>>>>>> develop
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
              secureTextEntry={!verPassword}
<<<<<<< HEAD
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
=======
              value={userData.password}
              onFocus={()=> setPasswordFocused(true)}
              onBlur={()=> setPasswordFocused(false)}
              onChangeText={(value) => handleInputChange("password", value)}
              maxLength={20}
>>>>>>> develop
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
              style={[
                styles.textInput,
                { paddingRight: 40 },
                confirmarPasswordFocused && { outline: "none" },
              ]}
              placeholder="Confirmar Contraseña"
              secureTextEntry={!verConfirmarPassword}
<<<<<<< HEAD
              onFocus={() => setConfirmarPasswordFocused(true)}
              onBlur={() => setConfirmarPasswordFocused(false)}
=======
              value={userData.confirmPassword}
              onFocus={()=> setConfirmarPasswordFocused(true)}
              onBlur={()=> setConfirmarPasswordFocused(false)}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              maxLength={20}
>>>>>>> develop
            />
            {verConfirmarPassword ? (
              <Pressable
                onPress={() => setVerConfirmarPassword(false)}
                style={{ position: "absolute", right: 10 }}
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
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.textButton}>Subir foto</Text>
          <Entypo
            name="camera"
            size={24}
            color="#000"
            style={{ paddingLeft: 5 }}
          />
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
            onPress={() => handleSignup()}
          >
            <Text style={styles.textButton}>Aceptar</Text>
          </Pressable>
        </View>
      </View>
      <Notificacion
        isVisible={modalVisible}
        isSuccess={modalSuccess}
        message={modalMessage}
        onClose={closeModal}
      />
    </ImageBackground>
  );
}

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

