import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode as decode } from "jwt-decode";

const linkUser = [
  {
    label: "Perfil",
    link: "/perfil",
  },
  {
    label: "Historial",
    link: "/historial",
  },
  {
    label: "Me gusta",
    link: "/megusta",
  },
  {
    label: "Locales",
    link: "/localpropio",
  },
];

const linkAdmin = [
  {
    label: "Perfil",
    link: "/perfil",
  },
  {
    label: "Historial",
    link: "/historial",
  },
  {
    label: "Me gusta",
    link: "/megusta",
  },
  {
    label: "Denuncias Locales",
    link: "/denunciaslocales",
  },
  {
    label: "Denuncias Comentarios",
    link: "/denunciasusuarios",
  },
  {
    label: "Buscar Usuarios",
    link: "/buscarusuarios",
  },
  {
    label: "Buscar Locales",
    link: "/buscarlocales",
  }
];

export default function AsideMainPage({ visible, setVisible }) {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "League-Gothic": require("../../assets/fonts/LeagueGothic-Regular.ttf"),
    "Open-Sans": require("../../assets/fonts/OpenSans-Regular.ttf"),
  });
  const [typo, setTypo] = useState("admin");

  if (!fontsLoaded) {
    console.log("waiting for fonts");
  }

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

  const getUserTypo = async () => {
    const token = await getToken();
    if (!token) return null;

    const decoded = decode(token);
    setTypo(decoded.typo);
  };

  useEffect(() => {
    getUserTypo();
  }, []);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} />
        <View style={styles.menu}>
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/logo_recortado.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>FOODIGO</Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setVisible(false)}
          >
            <Image
              source={require("@/assets/images/asidemainbutton.png")}
              style={styles.backImage}
            />
          </TouchableOpacity>

          {typo && typo != "admin" && linkUser.map((item, index) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setVisible(false);
                router.push(item.link);
              }}
              key={item.link}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          {typo && typo == "admin" && linkAdmin.map((item, index) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setVisible(false);
                router.push(item.link);
              }}
              key={item.link}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  menu: {
    width: "80%",
    marginTop: 5,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 100,
    marginRight: 10,
  },
  title: {
    fontSize: 100,
    color: "#FFF",
    fontFamily: "League-Gothic",
  },
  backButton: {
    marginBottom: 40,
  },
  backImage: {
    width: 40,
    height: 40,
  },
  menuItem: {
    width: "60%",
    padding: 8,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  menuText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: "Open-Sans",
  },
});
