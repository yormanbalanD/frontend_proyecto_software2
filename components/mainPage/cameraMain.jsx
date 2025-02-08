import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import { MediaLibrary } from "expo-media-library";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No se han concedido permisos para la cámara.</Text>
      </View>
    );
  }

  // if (device == null) {
  //     return (
  //         <View style={styles.container}>
  //             <Text>Cámara no disponible.</Text>
  //         </View>
  //     );
  // }

  // const handleTakePicture = async () => {
  //     if (camera.current) {
  //         try {
  //             const photo = await camera.current.takePhoto();
  //             console.log(photo); // Aquí puedes guardar la foto o mostrarla
  //         } catch (error) {
  //             console.error('Error al tomar la foto:', error);
  //         }
  //     }
  // };

  return (
    <View style={styles.container}>
      <Camera
        facing={facing}
        style={{
          flex: 1,
        }}
        ref={cameraRef}
      >
        <Text>Hello</Text>
      </Camera>
      {/* <View style={styles.buttonContainer}>
                {<TouchableOpacity style={styles.button} onPress={handleTakePicture}>
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                </TouchableOpacity>}
            </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
});
