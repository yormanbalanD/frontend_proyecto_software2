import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { jwtDecode as decode } from "jwt-decode";
import * as Location from "expo-location";
import { useCookies } from "react-cookie";
import * as ImagePicker from "expo-image-picker";

export default function ModalCrearLocal({ visible, onClose, onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [cookies] = useCookies(["token"]);

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value != null) {
        return value;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const getUserId = async () => {
    const token = await getToken();
    if (!token) return null;

    const decoded = decode(token);
    return decoded.sub;
  };

  const validarInputs = () => {
    if (!nombre.trim()) {
      onSuccess("El campo Nombre es obligatorio.", false);
      return false;
    }
    if (!descripcion.trim()) {
      onSuccess("El campo Descripción es obligatorio.", false);
      return false;
    }
    if (!ubicacion.trim()) {
      onSuccess("El campo Ubicación es obligatorio.", false);
      return false;
    }
    if (coordenadas === null) {
      onSuccess("Debe obtener las coordenadas para continuar.", false);
      return false;
    }
    if (imagen === null) {
      onSuccess("Debe seleccionar una imagen para continuar.", false);
      return false;
    }

    return true; // Si todo está bien, retorna true
  };

  const handleCrearLocal = async () => {
    if (!validarInputs()) return; // Si falla la validación, no ejecuta la petición

    const userId = getUserId(); // Obtiene el ID del usuario desde el token
    if (!userId) {
      alert("Error: No se pudo obtener el usuario. Inicia sesión nuevamente.");
      return;
    }
    const response = await fetch(
      "https://backend-swii.vercel.app/api/createRestaurant",
      {
        method: "POST",
        body: JSON.stringify({
          name: nombre,
          own: userId,
          fotoPerfil: imagen,
          description: descripcion,
          address: ubicacion,
          latitude: parseFloat(coordenadas.latitude), // Convertir a número si es string
          longitude: parseFloat(coordenadas.longitude),
          viewed: 0, // Inicialmente en 0
          reviews: [], // Iniciar con un array vacío
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await getToken()),
        },
      }
    );

    if (response.status === 200) {
      const result = await response.json();
      onSuccess("Local creado correctamente.", true);
      setNombre("");
      setDescripcion("");
      setUbicacion("");
      setCoordenadas(null);
      setImagen(null);
    } else {
      onSuccess("Error al crear local. Inténtalo de nuevo.", false);
    }
  };

  const handleCancelar = () => {
    setNombre("");
    setDescripcion("");
    setUbicacion("");
    setCoordenadas(null);
    setImagen(null);
    onClose();
  };

  const getCoordenadas = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado para acceder a la ubicación");
      return;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    setCoordenadas(location.coords);
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
      quality: 0.1, // Calidad de la imagen (1 = máxima calidad)
    });

    // Si el usuario no cancela, guardar la imagen seleccionada
    if (!resultado.canceled) {
      setImagen(`data:image/jpeg;base64,${resultado.assets[0].base64}`);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.modalTitle}>Nuevo Local</Text>

            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                maxLength={20}
                value={nombre}
                onChangeText={setNombre}
              />
              <Text style={styles.charCount}>{nombre.length}/20</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>

            <Text style={styles.label}>Descripción</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                maxLength={100}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
              />
              <Text style={styles.charCount}>{descripcion.length}/100</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>

            <Text style={styles.label}>Ubicación</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                maxLength={100}
                value={ubicacion}
                onChangeText={setUbicacion}
                multiline
              />
              <Text style={styles.charCount}>{ubicacion.length}/100</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>

            <View style={styles.coorTextContainer}>
              <MaterialIcons
                name="place"
                size={20}
                color="black"
                style={styles.icon}
              />
              <TextInput
                style={styles.inputCoord}
                value={
                  coordenadas
                    ? `${coordenadas.latitude}, ${coordenadas.longitude}`
                    : ""
                }
                editable={false}
              />
            </View>

            <TouchableOpacity
              onPress={getCoordenadas}
              style={styles.coordButton}
            >
              <Text style={styles.coordButtonText}>RECUPERAR COORDENADAS</Text>
              <Entypo name="location" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={seleccionarImagen}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>AÑADIR</Text>
              <MaterialIcons name="photo-camera" size={20} color="#fff" />
            </TouchableOpacity>

            {imagen && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imagen }} style={styles.image} />
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelar}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCrearLocal}
              >
                <Text style={styles.createButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff9f1",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  scrollContainer: {
    paddingBottom: 20, // Espacio para evitar que el contenido quede cortado
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    marginBottom: 30,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  asterisk: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -14 }],
    fontSize: 16,
    fontFamily: "Open-Sans",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontFamily: "Open-Sans",
    marginLeft: 4,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    fontFamily: "Open-Sans",
    marginTop: 2,
    marginRight: 10,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#736e69",
    borderRadius: 5,
    paddingRight: 20,
    paddingTop: 3,
    paddingBottom: 4,
  },
  inputCoord: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#736e69",
    borderRadius: 5,
    paddingLeft: 30,
    paddingBottom: 4,
  },
  icon: {
    position: "absolute",
    left: 5,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
  coorTextContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 4,
  },
  coordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8c1b1d",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  coordButtonText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 8,
    fontFamily: "Open-Sans",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0e87d6",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 50,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 8,
    fontFamily: "Open-Sans",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    padding: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#736e69",
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 12,
    fontFamily: "OpenSans-Bold",
  },
  createButton: {
    flex: 1,
    alignItems: "center",
    padding: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#736e69",
    marginLeft: 20,
  },
  createButtonText: {
    fontSize: 12,
    fontFamily: "OpenSans-Bold",
    color: "#736e69",
  },
  imageContainer: {
    width: 100, // Ajusta según el tamaño que necesites
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 40,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // Esto recorta la imagen para llenar el espacio cuadrado
  },
});
