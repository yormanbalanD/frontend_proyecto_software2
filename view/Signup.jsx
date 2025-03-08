import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import Notificacion from "@/components/ModalNotificacion";
import { useFetch } from "../utils/fetch/useFetch"; // Asegúrate de usar la importación con llaves
import endpoints from "../utils/fetch/endpoints-importantes.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function Signup() {
  const router = useRouter();

  //Handle verPassword
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmarPassword, setVerConfirmarPassword] = useState(false);

  //Handle onfocus
  const [nombreFocused, setNombreFocused] = React.useState(false);
  const [correoFocused, setCorreoFocused] = React.useState(false);
  const [PasswordFocused, setPasswordFocused] = React.useState(false);
  const [confirmarPasswordFocused, setConfirmarPasswordFocused] =
    React.useState(false);

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

  const preguntasSeguridad = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿Cuál es tu ciudad natal?",
    "¿Cuál es tu comida favorita?",
    "¿Cuál es el nombre de tu escuela primaria?",
  ];

  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal
  const [modalSuccess, setModalSuccess] = useState(false); // Éxito del modal

  const [preguntaSeguridad1, setPreguntaSeguridad1] = useState(preguntasSeguridad[0]);
  const [respuestaSeguridad1, setRespuestaSeguridad1] = useState("");
  const [preguntaSeguridad2, setPreguntaSeguridad2] = useState(preguntasSeguridad[1]);
  const [respuestaSeguridad2, setRespuestaSeguridad2] = useState("");

  const { data, loading, error, fetchData } = useFetch();
  const {
    data: emailValidationData,
    loading: emailValidationLoading,
    error: emailValidationError,
    fetchData: validateEmail,
  } = useFetch();

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
      setModalMessage(
        "El correo electrónico debe tener menos de 50 caracteres."
      );
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }

    const emailValidationUrl = `https://emailverification.whoisxmlapi.com/api/v3?apiKey=at_iFCVm77T67rg3vK28nnSUdCUNkpwW&emailAddress=${userData.email}`;
    const emailValidationOptions = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    await validateEmail(emailValidationUrl, emailValidationOptions); // Llama a useFetch

    if (emailValidationError) {
      setModalMessage(
        "Error al validar el correo electrónico: " +
          (emailValidationError.message || "Error desconocido")
      );
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
  };

  const seleccionarImagen = async () => {
      // Pedir permiso de acceso a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se requiere permiso para acceder a la galería.");
        return;
      }
  
      // Abrir la galería
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        base64: true,
        quality: 0.6, // Calidad de la imagen (1 = máxima calidad)
        allowsMultipleSelection: false,
      });
  
      // Si el usuario no cancela, guardar la imagen seleccionada
      if (!resultado.canceled) {
        setFotoPerfil(
          `data:${resultado.assets[0].mimeType};base64,${resultado.assets[0].base64}`
        );
      }
    };

  const handleSignup = async () => {
    if (!(await validarFormulario())) {
      return;
    }

    await fetchData("https://backend-swii.vercel.app/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  };

  const saveToken = async (value) => {
    try {
      const value = await AsyncStorage.setItem("token", value);
      console.log(value);
    } catch (e) {
      console.log(e);
      return null;
    }
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
      saveToken(data.token);
    }
  }, [loading, error, data]);

  const Signup = () => {
    router.push("mainpage");
  };

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
        height: "100dvh",
        width: "100dvw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View // Logo Container
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",          
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
            value={userData.name}
            onFocus={() => setNombreFocused(true)}
            onBlur={() => setNombreFocused(false)}
            onChangeText={(value) => handleInputChange("name", value)}
          />
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, correoFocused && { outline: "none" }]}
            value={userData.email}
            placeholder="Correo"
            onFocus={() => setCorreoFocused(true)}
            onBlur={() => setCorreoFocused(false)}
            onChangeText={(value) => handleInputChange("email", value)}
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
              value={userData.password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChangeText={(value) => handleInputChange("password", value)}
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
              value={userData.confirmPassword}
              onFocus={() => setConfirmarPasswordFocused(true)}
              onBlur={() => setConfirmarPasswordFocused(false)}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
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
           {/* Pregunta de seguridad 1 */}
          <Text style={styles.titulo}>Pregunta de Seguridad 1</Text>
          <Picker
            selectedValue={preguntaSeguridad1}
            onValueChange={(itemValue) => setPreguntaSeguridad1(itemValue)}
            style={{ color: Colors.white, width: "100%" }}
          >
            {preguntasSeguridad.map((pregunta, index) => (
              <Picker.Item key={index} label={pregunta} value={pregunta} />
            ))}
          </Picker>
          <TextInput
            placeholderTextColor={"#acacac"}
            style={styles.textInput}
            placeholder="Respuesta"
            value={respuestaSeguridad1}
            onChangeText={(value) => setRespuestaSeguridad1(value)}
          />

          {/* Pregunta de seguridad 2 */}
          <Text style={styles.titulo}>Pregunta de Seguridad 2</Text>
          <Picker
            selectedValue={preguntaSeguridad2}
            onValueChange={(itemValue) => setPreguntaSeguridad2(itemValue)}
            style={{ color: Colors.white, width: "100%" }}
          >
            {preguntasSeguridad.map((pregunta, index) => (
              <Picker.Item key={index} label={pregunta} value={pregunta} />
            ))}
          </Picker>
          <TextInput
            placeholderTextColor={"#acacac"}
            style={styles.textInput}
            placeholder="Respuesta"
            value={respuestaSeguridad2}
            onChangeText={(value) => setRespuestaSeguridad2(value)}
          />
        </View>

        <Pressable
          onPress={() => seleccionarImagen()}
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
