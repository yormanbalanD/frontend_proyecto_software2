import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  useAnimatedValue
} from "react-native";
import Colors from "../../constants/Colors";
// import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
// import { withSpring, useSharedValue } from "react-native-reanimated";

const WIDTH_ASIDE = 275

const styles = StyleSheet.create({
  iconButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  imageContainer: {
    width: "100%",
  },
  aside: {
    backgroundColor: Colors.primary,
    width: WIDTH_ASIDE, // Usar porcentaje en lugar de dvw
    height: "100%",
    paddingTop: 60,
    flexDirection: "column",
    borderWidth: 1,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: Colors.whiteTransparent,
    zIndex: 10,
  },
  textAsideContainer: {
    padding: 15,
    paddingLeft: 20,
  },
  textAside: {
    color: "#f5f5f5",
    fontSize: 18,
  },
  textAsidePressed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Fondo más oscuro al presionar
  },
});

export default function AsideMainPage({ visible }) {
  const animation = useRef(new Animated.Value(-WIDTH_ASIDE)).current;
  const navigation = useRouter();
  const [pressedItem, setPressedItem] = useState(null); // Estado para el item presionado

  const handlePressIn = (item) => {
    setPressedItem(item);
  };

  const handlePressOut = () => {
    setPressedItem(null);
  };

  const handlePress = (route) => {
    navigation.push(route); // Navegar a la ruta
  };

  //----------------------------AQUI LAS RUTAS DEL ASIDE
  const menuItems = [
    { label: "Historial", route: "historial" },
    { label: "Me gusta", route: "likes" },
  ];

  const showAside = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideAside = () => {
    Animated.timing(animation, {
      toValue: -WIDTH_ASIDE,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (visible) {
      showAside();
    } else {
      hideAside();
    }
    console.log("visible", visible);
    console.log("animation", animation);
  }, [visible]);

  return (
    <Animated.View
      style={[styles.aside, { transform: [{ translateX: animation }] }]}
    >
      <Image
        source={require("@/assets/images/logo.jpg")}
        style={styles.image}
      />
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.textAsideContainer,
            pressedItem === item.label && styles.textAsidePressed, // Estilo al presionar
          ]}
          onPressIn={() => handlePressIn(item.label)}
          onPressOut={handlePressOut}
          onPress={() => handlePress(item.route)} // Navegación al presionar
        >
          <Text style={styles.textAside}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}
