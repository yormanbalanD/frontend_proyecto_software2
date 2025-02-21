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

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const [angulo, setAngulo] = useState(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  });

  const tomarFoto = async () => {
    if (tomandoFoto) return;
    setTomandoFoto(true);

    cameraRef.current.takePictureAsync().then(() => {
      console.log("angulo", angulo);
      setTomandoFoto(false);
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
      <BotonRedondoCamara tomarFoto={tomarFoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
});
