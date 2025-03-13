import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Pressable,
  useAnimatedValue,
  Text,
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
import url from "@/constants/url";

const BotonSeleccionarDistancia = ({ setDistance, distance }) => {
  const yBloque1 = useAnimatedValue(0);
  const yBloque2 = useAnimatedValue(0);
  const yBloque3 = useAnimatedValue(0);
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
            setDistance(20);
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
          <Text style={{ fontSize: 19, fontWeight: 800 }}>20M</Text>
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

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const [angulo, setAngulo] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [targetaSeleccionada, setTargetaSeleccionada] = useState(null);
  const [abriendose, setAbriendose] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [promedioReseñas, setPromedioReseñas] = useState(0);
  const [distancia, setDistancia] = useState(20);

  /**
   *  @type {[{ _id: string; address: string; reviews: {}[]; distance: number; fotoPerfil: string; latitude: number; longitude: number; name: string; rating: number; name: string; description: string; viewed: number }[], {}]}
   */
  const [restaurantes, setRestaurantes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  async function solicitarPermisoParaElAnguloDeCamara() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    Location.watchHeadingAsync((heading) => {
      setAngulo(heading.magHeading);
    });
  }
  useEffect(() => {
    solicitarPermisoParaElAnguloDeCamara();
  }, []);

  const getCoordenadas = useCallback(async () => {
    console.log("Obteniendo coordenadas...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    console.log("Coordenadas obtenidas:", location.coords);
    return location.coords;
  }, []);

  const fetchRestaurantes = useCallback(
    async ({ angulo, base64 }) => {
      setLoading(true);
      setIsLoadingResults(true);
      console.log(angulo);
      console.log(angulo);
      console.log("Iniciando fetchRestaurantes...");
      const coords = await getCoordenadas();
      console.log("Coordenadas para fetch:", coords);

      const response = await fetch(
        url +
          "api/getNearbyRestaurants/" +
          coords.latitude +
          "/" +
          coords.longitude +
          "/" +
          parseInt(angulo) +
          "/" +
          distancia,
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
        setRestaurantes(
          data.escaneosNear.sort((a, b) => a.distance - b.distance)
        );
        setCurrentIndex(0);
      } else if (response.status === 404) {
        console.log("No se encontraron restaurantes.");
        setRestaurantes([]);
        setCurrentIndex(0);
        setTargetaSeleccionada(null);
        setVisibleModal(false);
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
    },
    [getCoordenadas]
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const tomarFoto = useCallback(async () => {
    if (tomandoFoto || isLoadingResults || restaurantes.length > 0) return;
    setTomandoFoto(true);
    console.log("Tomando foto...");
    const { base64 } = await cameraRef.current.takePictureAsync({
      base64: true,
    });
    setTomandoFoto(false);
    setVisibleModal(true);
    console.log("Foto tomada, iniciando fetchRestaurantes...");
    fetchRestaurantes({ angulo, base64 });
    cameraRef.current.pausePreview();
  }, [fetchRestaurantes, tomandoFoto, isLoadingResults, restaurantes]);

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

  const totalPages = useMemo(
    () => Math.ceil(restaurantes.length / 4),
    [restaurantes]
  );

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
  );

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  return (
    <View style={styles.container}>
      <CameraView facing={facing} style={{ flex: 1 }} ref={cameraRef} />
      <BotonSeleccionarDistancia
        distance={distancia}
        setDistance={setDistancia}
      />
      {visibleModal && (
        <View style={styles.fondoModal}>
          <Pressable
            onPress={() => {
              setVisibleModal(false);
              setRestaurantes([]);
              cameraRef.current.resumePreview();
            }}
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
          disabled={isLoadingResults || restaurantes.length > 0}
        />
      )}
      <ModalDeCarga visible={loading} />
      <ModalNotificacion
        isVisible={modalVisible}
        isSuccess={isSuccess}
        message={modalMessage}
        onClose={closeModal}
      />
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
    backgroundColor: Colors.blue,
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
