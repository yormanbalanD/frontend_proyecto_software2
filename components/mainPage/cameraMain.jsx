import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  Text,
  Animated,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import BotonRedondoCamara from "./BotonRedondoCamara";
import TargetaCamara from "./TargetaCamara";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDeCarga from "../ModalDeCarga";
import Colors from "../../constants/Colors";
import ModalNotificacion from "../ModalNotificacion";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const [angulo, setAngulo] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [targetaSeleccionada, setTargetaSeleccionada] = useState(null);
  const [abriendose, setAbriendose] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [restaurantes, setRestaurantes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [distancia, setDistancia] = useState(20);
  const [permisoUbicacionConcedido, setPermisoUbicacionConcedido] = useState(false);
  const [fondoImagen, setFondoImagen] = useState(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    const solicitarPermisos = async () => {
      console.log("Solicitando permisos de ubicación...");

      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Estado permisos ubicación:", status);

      if (status !== "granted") {
        console.error("Permisos de ubicación no concedidos");
        setPermisoUbicacionConcedido(false);
        setModalMessage("Se requieren permisos de ubicación para usar la brújula");
        setModalVisible(true);
        return;
      }

      setPermisoUbicacionConcedido(true);

      console.log("Iniciando monitor de orientación...");
      Location.watchHeadingAsync(heading => {
        console.log("Nuevo ángulo detectado:", heading.magHeading);
        setAngulo(heading.magHeading);
      }).catch(error => {
        console.error("Error en watchHeadingAsync:", error);
        setModalMessage("Error al acceder a la brújula del dispositivo");
        setModalVisible(true);
      });
    };

    solicitarPermisos();
  }, []);


  const getCoordenadas = useCallback(async () => {
    if (!permisoUbicacionConcedido) return null;

    try {
      console.log("Obteniendo coordenadas...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      console.log("Coordenadas obtenidas:", location.coords);
      return location.coords;
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      setModalMessage("Error obteniendo ubicación actual");
      setModalVisible(true);
      return null;
    }
  }, [permisoUbicacionConcedido]);

  const fetchRestaurantes = useCallback(
    async ({ angulo, base64 }) => {
      if (!angulo || !permisoUbicacionConcedido) {
        console.error("Ángulo o permisos no válidos");
        setModalMessage("Error de orientación: Reinicie la aplicación");
        setModalVisible(true);
        return;
      }

      setLoading(true);
      setIsLoadingResults(true);

      const coords = await getCoordenadas();
      if (!coords) {
        setLoading(false);
        setIsLoadingResults(false);
        return;
      }

      try {
        const response = await fetch(
          `https://backend-swii.vercel.app/api/getNearbyRestaurants/${coords.latitude}/${coords.longitude}/${angulo.toFixed(0)}/${distancia}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await AsyncStorage.getItem("token")),
            },
            body: JSON.stringify({ foto: base64 }),
          }
        );
    console.log("Respuesta del servidor:", response.status);

    if (response.status === 200) {
      const data = await response.json();
      console.log("Restaurantes obtenidos:", data);
      setRestaurantes(data.escaneosNear.sort((a, b) => a.distance - b.distance));
      setCurrentIndex(0);
    } else if (response.status === 404) {
      console.log("No se encontraron restaurantes.");
      setRestaurantes([]);
      setCurrentIndex(0);
      setTargetaSeleccionada(null);
      cameraRef.current.resumePreview();
      setIsSuccess(false);
      setModalMessage("No se encontraron restaurantes cercanos.");
      setModalVisible(true);
    } else {
      console.error("Error obteniendo restaurantes", await response.json());
      setIsSuccess(false);
      setModalMessage("Error obteniendo restaurantes.");
      setModalVisible(true);
    }
    setLoading(false);
    setIsLoadingResults(false);
    console.log("fetchRestaurantes finalizado.");

  } catch (error) {
    console.error("Error en fetch:", error);
    setModalMessage("Error de conexión con el servidor");
    setModalVisible(true);
  } finally {
    setLoading(false);
    setIsLoadingResults(false);
    }
  },
  [getCoordenadas, distancia, permisoUbicacionConcedido]
  );

  const tomarFoto = useCallback(async () => {
    if (!angulo) {
      console.log("Ángulo no disponible, no se puede tomar foto");
      setModalMessage("La brújula no está lista. Espera unos segundos");
      setModalVisible(true);
      return;
    }

    if (tomandoFoto || isLoadingResults || restaurantes.length > 0) return;

    setTomandoFoto(true);
    try {
      const { uri, base64 } = await cameraRef.current.takePictureAsync({ base64: true });
      setFondoImagen(uri); // Almacena la URI de la imagen capturada
      setVisibleModal(true);
      await fetchRestaurantes({ angulo, base64 });
      cameraRef.current.pausePreview();
    } catch (error) {
      console.error("Error tomando foto:", error);
      setModalMessage("Error al capturar la imagen");
      setModalVisible(true);
    } finally {
      setTomandoFoto(false);
    }
  }, [angulo, fetchRestaurantes, tomandoFoto, isLoadingResults, restaurantes]);

  const cerrarModalResultados = useCallback(() => {
    setVisibleModal(false);
    setRestaurantes([]);
    setFondoImagen(null); // Limpia la imagen de fondo
    cameraRef.current.resumePreview();
  }, [cameraRef, setVisibleModal, setRestaurantes, setFondoImagen]);


  const handleNext = useCallback(() => {
    if (currentIndex + 4 < restaurantes.length) {
      setCurrentIndex((prev) => prev + 4);
    }
  }, [restaurantes, currentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 4, 0));
    }
  }, [currentIndex]);

  const totalPages = useMemo(() => Math.ceil(restaurantes.length / 4), [restaurantes]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <TargetaCamara
        restaurante={item}
        index={index}
        setTargetaSeleccionada={setTargetaSeleccionada}
        targetaSeleccionada={targetaSeleccionada}
        abriendose={abriendose}
        setAbriendose={setAbriendose}
      />
    ),
    [targetaSeleccionada, abriendose]
  );64

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  const BotonSeleccionarDistancia = ({ setDistance, distance }) => {
    const yBloque1 = useRef(new Animated.Value(0)).current;
    const yBloque2 = useRef(new Animated.Value(0)).current;
    const yBloque3 = useRef(new Animated.Value(0)).current;
    const [open, setOpen] = useState(false);

    const abrir = () => {
      Animated.parallel([
        Animated.timing(yBloque1, {
          duration: 100,
          toValue: 70,
          useNativeDriver: true,
        }),
        Animated.timing(yBloque2, {
          duration: 100,
          toValue: 140,
          useNativeDriver: true,
        }),
        Animated.timing(yBloque3, {
          duration: 100,
          toValue: 210,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const cerrar = () => {
      Animated.parallel([
        Animated.timing(yBloque1, {
          duration: 100,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(yBloque2, {
          duration: 100,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(yBloque3, {
          duration: 100,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: 55,
          right: 30,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#fff8faf1",
            padding: 3,
            borderRadius: 6,
            aspectRatio: 1,
            width: 60,
            zIndex: distance == 20 ? 10 : 9,
          }}
          onPress={() => {
            if (!open) {
              abrir();
              setOpen(true);
            } else {
              cerrar();
              setOpen(false);
              // setDistance(20);
            }
          }}
        >
          <View
            style={{
              padding: 3,
              borderWidth: 1,
              borderRadius: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 19, fontWeight: 800 }}>{distance}M</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              backgroundColor: "#fff8faf1",
              padding: 3,
              borderRadius: 6,
              aspectRatio: 1,
              width: 60,
              zIndex: distance == 40 ? 10 : 8,
              position: "absolute",
            },
            {
              transform: [
                {
                  translateY: yBloque1,
                },
              ],
            },
          ]}
          onPress={() => {
            if (!open) {
              abrir();
              setOpen(true);
            } else {
              cerrar();
              setOpen(false);
              setDistance(40);
            }
          }}
        >
          <View
            style={{
              padding: 3,
              borderWidth: 1,
              borderRadius: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 19, fontWeight: 800 }}>40M</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              backgroundColor: "#fff8faf1",
              padding: 3,
              borderRadius: 6,
              aspectRatio: 1,
              width: 60,
              zIndex: distance == 60 ? 10 : 7,
              position: "absolute",
              transform: [
                {
                  translateY: yBloque2,
                },
              ],
            },
          ]}
          onPress={() => {
            if (!open) {
              abrir();
              setOpen(true);
            } else {
              cerrar();
              setOpen(false);
              setDistance(60);
            }
          }}
        >
          <View
            style={{
              padding: 3,
              borderWidth: 1,
              borderRadius: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 19, fontWeight: 800 }}>60M</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#fff8faf1",
            padding: 3,
            borderRadius: 6,
            aspectRatio: 1,
            width: 60,
            zIndex: distance == 80 ? 10 : 6,
            position: "absolute",
            transform: [
              {
                translateY: yBloque3,
              },
            ],
          }}
          onPress={() => {
            if (!open) {
              abrir();
              setOpen(true);
            } else {
              cerrar();
              setOpen(false);
              setDistance(80);
            }
          }}
        >
          <View
            style={{
              padding: 3,
              borderWidth: 1,
              borderRadius: 5,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 19, fontWeight: 800 }}>80M</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);


  return (
    <View style={styles.container}>
      <CameraView facing={facing} style={{ flex: 1 }} ref={cameraRef} />
      {visibleModal && (
        <View style={styles.fondoModal}>
          <Image source={{ uri: fondoImagen }} style={styles.fondoImagen} /> {/* Muestra la imagen de fondo */}
          <Pressable
            onPress={cerrarModalResultados}
            style={styles.pressable}
          />
          <FlatList
            data={restaurantes.slice(currentIndex, currentIndex + 4)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <View style={styles.pageIndicatorContainer}>
            <Text style={styles.pageIndicator}>
              {Math.floor(currentIndex / 4) + 1}/{totalPages}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentIndex === 0}
              style={styles.button}
            >
              <Ionicons
                name="chevron-up"
                size={30}
                color={currentIndex === 0 ? Colors.gray : Colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              disabled={currentIndex + 4 >= restaurantes.length}
              style={styles.button}
            >
              <Ionicons
                name="chevron-down"
                size={30}
                color={
                  currentIndex + 4 >= restaurantes.length
                    ? Colors.gray
                    : Colors.primary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!visibleModal && (
        <BotonRedondoCamara
          tomarFoto={tomarFoto}
          disabled={!angulo || isLoadingResults || restaurantes.length > 0}
        />
      )}
      <ModalDeCarga visible={loading} />
      <ModalNotificacion
        isVisible={modalVisible}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={closeModal}
      />
      <BotonSeleccionarDistancia distance={distancia} setDistance={setDistancia} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  separator: {
    height: 10,
  },
  pageIndicatorContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
  },
  pageIndicator: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "bold",
    backgroundColor: Colors.white,
    color: Colors.black,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 30,
    alignItems: "center",
    },
  pressable: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    },
});