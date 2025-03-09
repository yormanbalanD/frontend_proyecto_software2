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
import { useFetch } from "../utils/fetch/useFetch"; 
import endpoints from "../utils/fetch/endpoints-importantes.json";
import Arrow from "@/components/Arrow";
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

    if(!userData.fotoPerfil) {
      setModalMessage(
        "Es necesario que suba una foto de perfil"
      );
      setModalSuccess(false);
      setModalVisible(true);
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
    <ImageBackground
      source={require("@/assets/images/registrarse (2).png")}
      style={styles.imageBackground}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo_recortado.png")}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>FOODIGO</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.titulo}>Registrarse</Text>
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, nombreFocused && styles.inputFocused]}
            placeholder="Nombre Del Usuario"
            value={userData.name}
            onFocus={() => setNombreFocused(true)}
            onBlur={() => setNombreFocused(false)}
            onChangeText={(value) => handleInputChange("name", value)}
          />
          <TextInput
            placeholderTextColor={"#acacac"}
            style={[styles.textInput, correoFocused && styles.inputFocused]}
            value={userData.email}
            placeholder="Correo"
            onFocus={() => setCorreoFocused(true)}
            onBlur={() => setCorreoFocused(false)}
            onChangeText={(value) => handleInputChange("email", value)}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholderTextColor={"#acacac"}
              style={[
                styles.textInput,
                styles.passwordInput,
                PasswordFocused && styles.inputFocused,
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
                style={styles.eyeIcon}
              >
                <Entypo name="eye-with-line" size={24} color="#fff" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setVerPassword(true)}
                style={styles.eyeIcon}
              >
                <Entypo name="eye" size={24} color="#fff" />
              </Pressable>
            )}
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholderTextColor={"#acacac"}
              style={[
                styles.textInput,
                styles.passwordInput,
                confirmarPasswordFocused && styles.inputFocused,
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
                style={styles.eyeIcon}
              >
                <Entypo name="eye-with-line" size={24} color="#fff" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setVerConfirmarPassword(true)}
                style={styles.eyeIcon}
              >
                <Entypo name="eye" size={24} color="#fff" />
              </Pressable>
            )}
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preguntaSeguridad1}
              onValueChange={(itemValue) => setPreguntaSeguridad1(itemValue)}
              style={styles.picker}
              dropdownIconColor={Colors.lightGray}
            >
              {preguntasSeguridad.map((pregunta, index) => (
                <Picker.Item key={index} label={pregunta} value={pregunta} style={styles.pickerItem}/>
              ))}
            </Picker>
          </View>
          <TextInput
            placeholderTextColor={"#acacac"}
            style={styles.textInput}
            placeholder="Respuesta"
            value={respuestaSeguridad1}
            onChangeText={(value) => setRespuestaSeguridad1(value)}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preguntaSeguridad2}
              onValueChange={(itemValue) => setPreguntaSeguridad2(itemValue)}
              style={styles.picker}
              dropdownIconColor={Colors.lightGray}
              itemStyle={styles.pickerItem}
            >
              {preguntasSeguridad.map((pregunta, index) => (
                <Picker.Item key={index} label={pregunta} value={pregunta} style={styles.pickerItem}/>
              ))}
            </Picker>
          </View >
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
            pressed && styles.buttonPressed,
            styles.buttonWithIcon,
          ]}
        >
          <Text style={[styles.textButton, {color: Colors.white}]}>Subir foto</Text>
          <Entypo
            name="camera"
            size={24}
            color={Colors.white}
            style={styles.buttonIcon}
          />
        </Pressable>

        <View style={styles.buttonGroup}>
          <Pressable
            onPress={() => router.push("/")}
            style={({ pressed }) => [
              styles.buttonWithIcon,
              {padding: 15,
              borderRadius: 10,
              },
              {backgroundColor: Colors.vinoDark},
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.textButton, {color: Colors.white, marginLeft: 30}]}>Volver</Text>
            <View style={{ left: 15, position: "absolute", transform: [{ rotate: "180deg" }] }}>
              <Arrow />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.buttonWithIcon,
              {backgroundColor: Colors.vino},
              {padding: 15,
              borderRadius: 10,
              },
              pressed && styles.buttonPressed, 
            ]}
            onPress={() => handleSignup()}
          >
            <Text style={[styles.textButton, {color: Colors.white, marginRight: 30}]}>Aceptar</Text>
            <View style={{ right: 15, position: "absolute" }}>
              <Arrow />
            </View>
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
  imageBackground: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logoImage: {
    width: "10%",
    height: "70%",
    resizeMode: "center"
  },
  logoText: {
    color: '#FFF',
    fontFamily: 'League-Gothic',
    fontSize: 60,    
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, 0.6)",
    padding: 20,
    width: "90%",
    gap: 10,
    borderRadius: 20
  },
  inputContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 5
  },
  titulo: {
    color: Colors.white,
    fontFamily: "HeliosExt-Regular",
    fontSize: 26,
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
    fontSize: 14,
  },  
  passwordContainer: {
    justifyContent: "center",
    margin: 0
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  picker: {
    color: Colors.lightGray,
    backgroundColor: "transparent",
    width: "100%",
    fontFamily: "Open-sans",
    fontSize: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pickerItem: {
    fontFamily: "Open-sans",
    fontSize: 14,
    width: "100%",
    color: Colors.black
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    overflow: "hidden",
    
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
  buttonPressed: {
    backgroundColor: Colors.lightGray,
  },
  buttonWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blue,
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
  buttonIcon: {
    paddingLeft: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    width: "100%",
    marginTop: 10
  },
});