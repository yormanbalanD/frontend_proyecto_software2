import Colors from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  NativeModules,
  LayoutAnimation,
  Image,
  Platform,
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

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default function TargetaCamara({
  restaurante,
  index,
  targetaSeleccionada,
  setTargetaSeleccionada,
  abriendose,
  setAbriendose,
}) {
  const ref = useRef();
  const [height, setHeight] = useState(INITIAL_HEIGHT);
  const router = useRouter();

  const abrirTargeta = () => {
    if (abriendose) return;
    if (Platform.Version > 35) {
      setAbriendose(true);
      LayoutAnimation.spring(() => {
        setAbriendose(false);
      });
    }
    if (targetaSeleccionada === index) {
      setHeight(INITIAL_HEIGHT);
      setTargetaSeleccionada(null);
    } else {
      setHeight(INITIAL_HEIGHT + EXTRA_HEIGHT);
      setTargetaSeleccionada(index);
    }
  };

  useEffect(() => {
    console.log("Platform.Version", Platform.Version);

    if (Platform.Version > 35) {
      LayoutAnimation.spring();
    }
    if (targetaSeleccionada != index) {
      setHeight(INITIAL_HEIGHT);
    } else {
      setHeight(INITIAL_HEIGHT + EXTRA_HEIGHT);
    }
  }, [targetaSeleccionada]);

  return (
    <Pressable
      onPress={() => {
        if (targetaSeleccionada === index) return;
        abrirTargeta();
      }}
      style={styles.containerDashed}
    >
      <Animated.View
        ref={ref.current}
        style={{
          ...styles.container,
          height,
        }}
      >
        <Pressable
          style={{
            width: "100%",
            paddingHorizontal: 50,
            paddingVertical: PADDING_VERTICAL,
            alignItems: "center",
          }}
          onPress={abrirTargeta}
        >
          <Pressable style={styles.close}>
            <EvilIcons name="close" size={23} color={Colors.primary} />
          </Pressable>
          <Text style={{ fontSize: FONT_SIZE, fontWeight: 700 }}>
            {restaurante.name}
          </Text>
        </Pressable>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 6,
          }}
        >
          <Image
            source={{
              uri: restaurante.fotoPerfil.startsWith("data:image")
                ? restaurante.fotoPerfil
                : `data:image/jpg;base64,${restaurante.fotoPerfil}`,
            }}
            style={{
              height: 140,
              borderRadius: 7,
              backgroundColor: "#cdcdcd",
            }}
          />
          {/* <Text>
            {restaurante.latitude.toFixed(6)},{" "}
            {restaurante.longitude.toFixed(6)}
          </Text> */}
          <View style={{ alignItems: "center" }}>
            <Pressable
              onPress={() => {
                router.push(`/local?restaurante=${restaurante._id}`);
              }}
              style={({ pressed }) => [
                styles.botonVerDetalles,
                { backgroundColor: pressed ? Colors.green : Colors.greenDark },
              ]}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: 700,
                }}
              >
                Ver Detalles
              </Text>
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
    transitionDuration: 300,
    position: "relative",
    overflow: "hidden",
    borderRadius: 7,
  },
  close: {
    position: "absolute",
    left: 5,
    top: PADDING_VERTICAL - 1,
    zIndex: 10,
  },
  botonVerDetalles: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "auto",
    borderRadius: 5,
  },
});
