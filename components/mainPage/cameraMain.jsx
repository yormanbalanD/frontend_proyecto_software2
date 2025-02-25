import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import { MediaLibrary } from "expo-media-library";
import BotonRedondoCamara from "./BotonRedondoCamara";
import { set } from "react-hook-form";
import * as Location from "expo-location";
import * as geolib from "geolib";
import TargetaCamara from "./TargetaCamara";

const negociosMinifinca = [
  {
    latitud: 8.25217693739277,
    longitud: -62.74120469516385,
    nombre: "Restaurante Manos Criollas",
  },
  {
    latitud: 8.252016694798241,
    longitud: -62.7412507498899,
    nombre: "Restaurante Manos no Criollas",
  },
  {
    latitud: 8.25177169365717,
    longitud: -62.74125455857067,
    nombre: "Restaurante daniel",
  },
];

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
  const [restaurantes, setRestaurantes] = useState([
    {
      latitud: 0,
      longitud: 0,
      nombre: "",
      distancia: 0,
    },
  ]);

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

    setRestaurantes(
      negociosMinifinca.map((negocio) => {
        return {
          ...negocio,
          distancia: geolib.getDistance(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            {
              longitude: negocio.longitud,
              latitude: negocio.latitud,
            }
          ),
        };
      })
    );
  };
  const tomarFoto = async () => {
    if (tomandoFoto) return;
    setTomandoFoto(true);

    cameraRef.current.takePictureAsync().then(({ base64, width, height }) => {
      console.log("angulo", angulo);
      setTomandoFoto(false);
      fetchRestaurantes({
        angulo,
        base64,
      });
    });
  };

  async function solicitarPermisoParaElAnguloDeCamara() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
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
      {/* {restaurantes[0].nombre != "" && restaurantes.map((restaurante) => {
        return <TargetaCamara restaurante={restaurante} />;
      })} */}
      <BotonRedondoCamara tomarFoto={tomarFoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
});
