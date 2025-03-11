import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Button,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import { MediaLibrary } from "expo-media-library";
import BotonRedondoCamara from "./BotonRedondoCamara";
import { set } from "react-hook-form";
import * as Location from "expo-location";
import * as geolib from "geolib";
import TargetaCamara from "./TargetaCamara";
import { useCookies } from "react-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";

const negociosRioAro = [
  {
    latitud: 8.273658194401143,
    longitud: -62.74665134535704,
    nombre: "Restaurante Manos Criollas",
  },
];

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const [angulo, setAngulo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [targetaSeleccionada, setTargetaSeleccionada] = useState(null);
  const [abriendose, setAbriendose] = useState(false);
  const [promedioReseñas, setPromedioReseñas] = useState(0);

  /**
   *  @type {[{ _id: string; address: string; reviews: {}[]; distance: number; fotoPerfil: string; latitude: number; longitude: number; name: string; rating: number; name: string; description: string; viewed: number }[], {}]}
   */
  const [restaurantes, setRestaurantes] = useState([]);

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

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  });

  const getCoordenadas = async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return location.coords;
  };

  const fetchRestaurantes = async ({ angulo, base64 }) => {
    const coords = await getCoordenadas();

    const response = await fetch(
      "https://backend-swii.vercel.app/api/getNearbyRestaurants/" +
        coords.latitude +
        "/" +
        coords.longitude +
        "/" +
        angulo.toFixed(0) +
        "/50000",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await getToken()),
        },
        body: JSON.stringify({
          foto: base64,
        }),
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      /**
       *  @type {{ _id: string; address: string; reviews: {}[]; distance: number; fotoPerfil: string; latitude: number; longitude: number; name: string; rating: number; name: string; description: string; viewed: number }[]}
       */
      const restaurantes = data.escaneosNear
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);
      setRestaurantes(restaurantes);
    } else {
      console.log(response)
      console.log("error", await response.json());
      setVisibleModal(false);
      cameraRef.current.resumePreview();
    }
  };
  const tomarFoto = async () => {
    if (tomandoFoto) return;
    setTomandoFoto(true);

    await cameraRef.current
      .takePictureAsync()
      .then(({ base64, width, height }) => {
        console.log("angulo", angulo);
        setTomandoFoto(false);
        setVisibleModal(true);
        fetchRestaurantes({
          angulo,
          base64,
        });
      });
    cameraRef.current.pausePreview();
  };

  async function solicitarPermisoParaElAnguloDeCamara() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("El permiso de acceso a la ubicaion no fue concedido");
      return;
    }

    Location.watchHeadingAsync((heading) => {
      setAngulo(heading.magHeading);
    });
  }

  useEffect(() => {
    solicitarPermisoParaElAnguloDeCamara();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        facing={facing}
        style={{
          flex: 1,
        }}
        ref={cameraRef}
      ></CameraView>
      {visibleModal && (
        <View style={{ ...styles.fondoModal }}>
          <Pressable
            onPress={() => {
              cameraRef.current.resumePreview();
              setVisibleModal(false);
              setRestaurantes([]);
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <View style={{ gap: 15, backgroundColor: "transparent" }}>
            {restaurantes.length > 0 &&
              restaurantes.map((restaurante, index) => {
                return (
                  <TargetaCamara
                    key={index}
                    restaurante={restaurante}
                    index={index}
                    setTargetaSeleccionada={setTargetaSeleccionada}
                    targetaSeleccionada={targetaSeleccionada}
                    abriendose={abriendose}
                    setAbriendose={setAbriendose}
                  />
                );
              })}
          </View>
        </View>
      )}
      <BotonRedondoCamara tomarFoto={tomarFoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  fondoModal: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
