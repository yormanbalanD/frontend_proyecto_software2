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

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [tomandoFoto, setTomandoFoto] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  });

  const tomarFoto = async () => {
    if (tomandoFoto) return;
    setTomandoFoto(true);
    cameraRef.current.takePictureAsync().then(() => {
      setTomandoFoto(false);
    });
  };

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
