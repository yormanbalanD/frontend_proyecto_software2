import Colors from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  LayoutAnimation,
  Image,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router";

const PADDING_VERTICAL = 13;
const PADDING_VERTICAL_CAJA_EXTERNA = 4;
const FONT_SIZE = 15;
const INITIAL_HEIGHT =
  PADDING_VERTICAL * 2 + FONT_SIZE + PADDING_VERTICAL_CAJA_EXTERNA * 2;
const EXTRA_HEIGHT = 200;

const { UIManager } = NativeModules;

import { NativeModules, Platform } from 'react-native';

if (Platform.OS === "android") {
  if (NativeModules.UIManager) { 
    if (NativeModules.UIManager.setLayoutAnimationEnabledExperimental) { 
      NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
}

export default function TargetaCamara({
  restaurante,
  index,
  targetaSeleccionada,
  setTargetaSeleccionada,
  abriendose,
  setAbriendose,
}) {
  const ref = useRef();
  const [height, setHeight] = useState(new Animated.Value(INITIAL_HEIGHT));
  const router = useRouter();

  const animateHeight = (toValue, callback = () => {}) => {
    Animated.timing(height, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(callback);
  };

  const toggleTargeta = () => {
    if (abriendose) return;

    setAbriendose(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      setAbriendose(false);
    });

    if (targetaSeleccionada === index) {
      animateHeight(INITIAL_HEIGHT, () => setTargetaSeleccionada(null));
    } else {
      animateHeight(INITIAL_HEIGHT + EXTRA_HEIGHT, () =>
        setTargetaSeleccionada(index)
      );
    }
  };

  useEffect(() => {
    if (targetaSeleccionada === index) {
      animateHeight(INITIAL_HEIGHT + EXTRA_HEIGHT);
    } else {
      animateHeight(INITIAL_HEIGHT);
    }
  }, [targetaSeleccionada, index]);

  return (
    <Pressable onPress={toggleTargeta} style={styles.containerDashed}>
      <Animated.View ref={ref} style={[styles.container, { height }]}>
        <Pressable style={styles.header} onPress={toggleTargeta}>
          <Pressable style={styles.close}>
            <EvilIcons name="close" size={23} color={Colors.primary} />
          </Pressable>
          <Text style={styles.title}>{restaurante.name}</Text>
        </Pressable>
        <View style={styles.content}>
          <Image
            source={{
              uri:
                restaurante.fotoPerfil.startsWith("data:image")
                ? restaurante.fotoPerfil
                : `data:image/jpg;base64,${restaurante.fotoPerfil}`,
            }}
            style={styles.image}
          />
          <Text>Se encuentra a: {restaurante.distance}</Text>
          <View style={{ alignItems: "center" }}>            
            <Pressable
              onPress={() => router.push(`/local?restaurante=${restaurante._id}`)}
              style={({ pressed }) => [
                styles.botonVerDetalles,
                { backgroundColor: pressed ? Colors.green : Colors.greenDark },
              ]}
            >
              <Text style={styles.botonText}>Ver Detalles</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerDashed: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    borderStyle: "dashed",
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 4,
  },
  container: {
    backgroundColor: Colors.white,
    width: 290,
    borderRadius: 7,
    overflow: "hidden",
  },
  header: {
    width: "100%",
    paddingHorizontal: 50,
    paddingVertical: PADDING_VERTICAL,
    alignItems: "center",
  },
  close: {
    position: "absolute",
    left: 5,
    top: PADDING_VERTICAL - 1,
    zIndex: 10,
  },
  title: {
    fontSize: FONT_SIZE,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  image: {
    height: 140,
    borderRadius: 7,
    backgroundColor: "#cdcdcd",
  },
  botonVerDetalles: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  botonText: {
    color: Colors.white,
    fontWeight: "700",
  },
});