import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import * as Font from "expo-font";
import { Tab, TabView } from "@rneui/themed";
import Icon from "@expo/vector-icons/FontAwesome";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCookies } from "react-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlaceholderFotoPerfil from "../components/PlaceholderFotoPerfil";
import ModalCrearComentario from "../components/ModalCrearComentario";
import TabDescripcion from "../components/Local/TabDescripcion";
import TabOpiniones from "../components/Local/TabOpiniones";
import PlaceholderFoto from "../components/PlaceHolderFoto";
import PlaceholderText from "../components/PlaceholderText";
import { jwtDecode as decode } from "jwt-decode";
import { set } from "react-hook-form";
import ModalEditarComentario from "../components/ModalEditarComentario";

import ReportComment from "../view/ReportComment";

const Local = () => {
  const params = useLocalSearchParams();
  const navigate = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [restaurante, setRestaurante] = useState({
    fotoPerfil: "",
  });
  const [modalCrearComentarioVisible, setModalCrearComentarioVisible] =
    useState(false);
  const [cookies] = useCookies(["token"]);
  const [liked, setLiked] = useState(false);
  const [comentarioAEditar, setComentarioAEditar] = useState(null);
  const [comentarioADenunciar, setComentarioADenunciar] = useState(null);
  const [modalEditarComentario, setModalEditarComentario] = useState(false);
  const [modalReportComentario, setModalReportComentario] = useState(false);

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

  const getDatosDelRestaurante = async () => {
    const response = await fetch(
      "https://backend-swii.vercel.app/api/getRestaurant/" + params.restaurante,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await getToken()),
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      setRestaurante(data.restaurantFound);
      setComentarios(data.restaurantFound.reviews);
      setLiked(data.liked);
    } else {
      console.log("error");
      console.log(response);
    }
  };

  useEffect(() => {
    if (!params.restaurante) {
      console.log("no hay restaurante");
      navigate.back();
      return;
    }

    getDatosDelRestaurante();
  }, [modalCrearComentarioVisible]);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "League-Gothic": require("../assets/fonts/LeagueGothic-Regular.ttf"),
        "Open-Sans": require("../assets/fonts/OpenSans-Regular.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const [index, setIndex] = useState(0);

  const calcCantidadOpiniones = (comentarios) => {
    const cantidad = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    comentarios.forEach(({ calificacion }) => {
      cantidad[calificacion] += 1;
    });
    return cantidad;
  };

  const toggleLike = async () => {
    try {
      if (!liked) {
        const response = await fetch(
          "https://backend-swii.vercel.app/api/addFavoriteRestaurant",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await getToken()),
            },
            body: JSON.stringify({
              restaurantId: restaurante._id,
            }),
          }
        );

        setLiked(true);
        if (response.status === 200) {
          const data = await response.json();
        } else {
          console.log("error Liked");
          setLiked(false);
        }
      } else {
        const response = await fetch(
          "https://backend-swii.vercel.app/api/deleteRestaurantFromLiked/" +
            (await getUserId()),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await getToken()),
            },
            body: JSON.stringify({
              idRestaurants: [restaurante._id],
            }),
          }
        );
        setLiked(false);

        if (response.status === 200) {
          const data = await response.json();
        } else {
          console.log("error DisLiked");
          setLiked(true);
        }
      }
    } catch (error) {
      console.log(error);
      setLiked(!liked);
    }
  };

  const cantidad = calcCantidadOpiniones(comentarios);
  const maxOpiniones = Math.max(...Object.values(cantidad));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigate.back()}>
            <Icon name="chevron-left" size={35} color="#8c0e03" />
          </Pressable>
          <Image
            source={require("../assets/images/logo_recortado.png")}
            style={styles.logo}
          />
          <Text style={styles.titulo}>FOODIGO</Text>
        </View>

        <View style={styles.restauranteInfo}>
          <Text style={styles.restauranteNombre}>{restaurante.name}</Text>
          <View style={styles.seccion}>
            <Pressable onPress={toggleLike} style={{ marginRight: 10 }}>
              <Icon
                name={liked ? "heart" : "heart-o"}
                type="font-awesome"
                size={30}
                color="#8c0e03"
                style={{ ...styles.iconos }}
              />
            </Pressable>
            <Icon
              name="comments"
              type="font-awesome"
              size={30}
              color="#2199e4"
              style={styles.iconos}
            />

            {!restaurante.reviews ? (
              <PlaceholderText
                style={{
                  width: "30",
                  marginRight: 8,
                }}
                width={30}
                fontSize={20}
              />
            ) : (
              <Text style={styles.ratingText}>
                {restaurante.reviews ? restaurante.reviews.length : 0}
              </Text>
            )}
            <Icon
              name="star"
              type="font-awesome"
              size={30}
              color="#e4dd21"
              style={styles.iconos}
            />
            {!restaurante.reviews ? (
              <PlaceholderText
                style={{
                  width: "30",
                  marginRight: 8,
                }}
                width={30}
                fontSize={20}
              />
            ) : (
              <Text style={styles.ratingText}>
                {restaurante.reviews.length > 0 &&
                  (
                    restaurante.reviews.reduce(
                      (a, b) => parseInt(a) + parseInt(b.calification),
                      0
                    ) / restaurante.reviews.length
                  ).toFixed(1)}
                {restaurante.reviews.length == 0 && "0"}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            ...styles.imageLogoContainer,
          }}
        >
          {!restaurante.fotoPerfil ? (
            <PlaceholderFoto width={"100%"} height={"100%"} />
          ) : (
            <Image
              source={{ uri: restaurante.fotoPerfil }}
              style={{ ...styles.fixedImage }}
            />
          )}
        </View>

        <Tab
          value={index}
          onChange={setIndex}
          indicatorStyle={{ backgroundColor: "#07f" }}
          style={styles.tabvistas}
        >
          <Tab.Item
            title="Descripcion"
            titleStyle={{
              color: index === 0 ? "#07f" : "gray",
            }}
          />
          <Tab.Item
            title="Opiniones"
            titleStyle={{
              color: index === 1 ? "#07f" : "gray",
            }}
          />
        </Tab>

        <TabView
          value={index}
          onChange={setIndex}
          animationType="spring"
          minSwipeRatio={0.3}
        >
          {/* Descripcion */}
          <TabDescripcion restaurante={restaurante} />

          {/* Opiniones */}
          <TabOpiniones
            restaurante={restaurante}
            setModalEditarComentarioVisible={setModalEditarComentario}
            setModalCrearComentarioVisible={setModalCrearComentarioVisible}
            setComentarioAEditar={setComentarioAEditar}
            setModalReportComentario={setModalReportComentario}
            setComentarioADenunciar={setComentarioADenunciar}
          />
        </TabView>
      </SafeAreaView>
      <ModalCrearComentario
        restaurante={restaurante}
        visible={modalCrearComentarioVisible}
        onClose={() => setModalCrearComentarioVisible(false)}
      />
      <ModalEditarComentario
        restaurante={restaurante}
        onClose={() => {
          setComentarioAEditar(null);
          setModalEditarComentario(false);
        }}
        visible={modalEditarComentario}
        comentario={comentarioAEditar}
      />
      <ReportComment visible={modalReportComentario} onClose={() => {
        setModalReportComentario(false)
      }} idRestaurante={restaurante.description ? restaurante._id: ""} idComentario={comentarioADenunciar != null ? comentarioADenunciar._id : ""} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Open-Sans",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  titulo: {
    color: "black",
    fontFamily: "League-Gothic",
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  CalificacionDistribucionContainer: {
    marginBottom: 20,
    width: "50%",
  },
  ratingBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

  barraCalificacionFondo: {
    flex: 1,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#656874",
    overflow: "hidden",
    padding: 1,
  },

  barraCalificacionRelleno: {
    height: "100%",
    backgroundColor: "#f4b400",
    borderRadius: 5,
  },

  ratingCount: {
    width: 30,
    textAlign: "center",
  },

  total: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#00000029",
  },

  promedioTexto: {
    fontWeight: "bold",
    fontSize: 10,
  },

  puntuacionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    alignItems: "left",
  },
  seccion: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconos: {
    marginRight: 3,
    width: 30,
    height: 30,
  },

  restauranteInfo: {
    padding: 10,
  },

  restauranteNombre: {
    fontSize: 24,
    fontWeight: "bold",
  },

  restauranteTipo: {
    color: "gray",
    fontSize: 16,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  ratingText: {
    marginRight: 8,
    fontSize: 16,
    alignItems: "center",
    fontWeight: "bold",
  },

  tabVista: {
    width: "100%",
    padding: 10,
  },
  tabVistaComentarios: {
    width: "100%",
    height: 500,
    padding: 10,
  },
  tabvistas: {},

  lista: {
    width: 100,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 2,
    color: "black",
  },

  image: {
    marginTop: 10,
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: "contain",
  },
  descripcion: {
    fontSize: 16,
    marginVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
    marginLeft: 10,
  },

  imageLogoContainer: {
    position: "relative",
    alignItems: "center",
    height: 220,
  },

  fixedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },

  logoContainer: {
    position: "absolute",
    bottom: "65%",
    right: 20,
    transform: [{ translateY: -40 }],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 3,
  },

  circularLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 40,
  },

  circularLogoComent: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 40,
    marginLeft: 40,
  },

  card: {
    backgroundColor: "#8c0e03",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  logoContainerComent: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",

    marginRight: 5,
    marginTop: "5%",
    marginBottom: "5%",
    borderWidth: 2,
    borderColor: "#fff",
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
  },

  logoImage: {
    resizeMode: "cover",
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "#fff",
  },
  cardTexto: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  nombreCc: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 5,
    color: "#fff",
  },
  calificacion: {
    alignSelf: "flex-start",
    marginVertical: 5,
    heigth: 2,
    width: 2,
    backgroundColor: "#fff",
  },
  calificacion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  comentario: {
    alignItems: "center",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },

  fototexto: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  fotoHeader: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },

  icono: {
    width: 30,
    height: 30,
    margin: 5,
  },
  botonComentario: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: "gray",
    marginBottom: 10,
  },
  botonTexto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  imageLocalContainer: {
    marginBottom: 50,
  },
  fotoPerfil: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
  },
});

export default Local;
