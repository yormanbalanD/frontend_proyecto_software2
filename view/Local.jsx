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

const StarRating = ({ rating, maxStars = 5 }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(maxStars)].map((_, i) => (
        <Icon
          key={i}
          name={i < rating ? "star" : "star"}
          color={i < rating ? "#FFD700" : "#fff"}
          size={20}
        />
      ))}
    </View>
  );
};

const RenderComentario = ({ item }) => {
  const [fotoPerfil, setFotoPerfil] = useState(null);
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

  const getUser = async () => {
    const response = await fetch(
      "https://backend-swii.vercel.app/api/getUser/" + item.idUser,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      const data = await response.json();
      setFotoPerfil(data.userFound.fotoPerfil);
      console.log(data);
    } else {
      console.log(await response.json());
      alert("Error");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardTexto}>
        <Text style={styles.comentario}>{item.comment}</Text>
        <Text style={styles.nombreCc}>{item.userName}</Text>
        <StarRating rating={item.calificacion} />
      </View>
      <View style={styles.logoContainerComent}>
        {fotoPerfil == null ? (
          <PlaceholderFotoPerfil size={50} fontSize={50} />
        ) : (
          <Image
            source={
              !fotoPerfil.startsWith("data:image")
                ? require("@/assets/images/avatarPrueba.png")
                : fotoPerfil
            }
            style={styles.fotoPerfil}
          />
        )}
      </View>
    </View>
  );
};

const Local = () => {
  const params = useLocalSearchParams();
  const navigate = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [restaurante, setRestaurante] = useState({
    fotoPerfil: "",
  });
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
      delete data.restaurantFound.fotoPerfil;
      console.log(data.restaurantFound.reviews);
    } else {
      console.log("error");
      console.log(response);
    }
  };

  useEffect(() => {
    console.log(params);
    if (!params.restaurante) {
      console.log("no hay restaurante");
      navigate.back();
      return;
    }

    getDatosDelRestaurante();
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "League-Gothic": require("../assets/fonts/LeagueGothic-Regular.ttf"),
        "Open-Sans": require("../assets/fonts/OpenSans-Regular.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
    console.log(params);
  }, []);

  const [index, setIndex] = useState(0);
  const images = [
    { id: "1", source: require("../assets/images/McDonald's_logo.svg.png") },
    { id: "2", source: require("../assets/images/local2.png") },
    { id: "3", source: require("../assets/images/local3.jpg") },
    { id: "4", source: require("../assets/images/local3.jpg") },
    { id: "5", source: require("../assets/images/local3.jpg") },
    { id: "6", source: require("../assets/images/local3.jpg") },
  ];

  const renderImagen = ({ item }) => (
    <View style={styles.imageLocalContainer}>
      <Image source={item.source} style={styles.image} />
    </View>
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const sigImagen = () => {
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const antImagen = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(prevIndex);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const calcCantidadOpiniones = (comentarios) => {
    const cantidad = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    comentarios.forEach(({ calificacion }) => {
      cantidad[calificacion] += 1;
    });
    return cantidad;
  };

  const cantidad = calcCantidadOpiniones(comentarios);
  const maxOpiniones = Math.max(...Object.values(cantidad));

  const RatingBar = ({ rating, count }) => (
    <View style={styles.ratingBarContainer}>
      <Text style={styles.ratingText}>{rating}</Text>
      <View style={styles.barraCalificacionFondo}>
        <View
          style={[
            styles.barraCalificacionRelleno,
            { width: `${(count / maxOpiniones) * 100}%` },
          ]}
        />
      </View>
    </View>
  );

  const totalComentarios = comentarios.length;

  const promedioCalificacion =
    totalComentarios > 0
      ? comentarios.reduce((sum, item) => sum + item.calificacion, 0) /
        totalComentarios
      : 0;

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
            <Pressable style={{ marginRight: 10 }}>
              <Icon
                name="heart"
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
            <Text style={styles.ratingText}>
              {restaurante.reviews ? restaurante.reviews.length : 0}
            </Text>
            <Icon
              name="star"
              type="font-awesome"
              size={30}
              color="#e4dd21"
              style={styles.iconos}
            />
            <Text style={styles.ratingText}>
              {restaurante.reviews &&
                restaurante.reviews.length > 0 &&
                (
                  restaurante.reviews.reduce(
                    (a, b) => parseInt(a) + parseInt(b.calification),
                    0
                  ) / restaurante.reviews.length
                ).toFixed(1)}
              {restaurante.reviews && restaurante.reviews.length == 0 && "0"}
            </Text>
          </View>
        </View>

        <View style={styles.imageLogoContainer}>
          {!restaurante.fotoPerfil ? (
            <View />
          ) : (
            <Image
              source={{ uri: restaurante.fotoPerfil }}
              style={{ ...styles.fixedImage, backgroundColor: "#cdcdcd97" }}
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

        <TabView value={index} onChange={setIndex} animationType="spring">
          {/* Descripcion */}
          <TabView.Item>
            <ScrollView>
              <View>
                <View style={styles.descripcion}>
                  <Text
                    style={{ ...styles.descripcion, padding: 0, marginLeft: 0 }}
                  >
                    {restaurante.description}
                  </Text>
                </View>
                <View style={styles.descripcion}>
                  <Icon name="map-marker" size={35} color="#8c0e03" />
                  <Text style={styles.descripcion}>
                    {restaurante.latitude}, {restaurante.longitude}
                  </Text>
                </View>
                <View style={styles.descripcion}>
                  <Icon name="location-arrow" size={35} color="#8c0e03" />
                  <Text style={styles.descripcion}>{restaurante.address}</Text>
                </View>

                <Text style={styles.fototexto}>Fotos</Text>
                <View style={styles.fotoHeader}>
                  <TouchableOpacity onPress={antImagen}>
                    <Icon
                      name="chevron-circle-left"
                      size={25}
                      color="#8c0e03"
                    />
                  </TouchableOpacity>
                  <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderImagen}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.lista}
                  />
                  <TouchableOpacity onPress={sigImagen}>
                    <Icon
                      name="chevron-circle-right"
                      type="font-awesome"
                      size={25}
                      color="#8c0e03"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TabView.Item>

          {/* Opiniones */}
          <TabView.Item>
            <ScrollView>
              <View style={styles.total}>
                <View style={styles.CalificacionDistribucionContainer}>
                  {Object.entries(cantidad)
                    .reverse()
                    .map(([rating, count]) => (
                      <RatingBar key={rating} rating={rating} count={count} />
                    ))}
                </View>

                <View style={styles.puntuacionContainer}>
                  <Text style={{ fontSize: 40 }}>
                    {promedioCalificacion.toFixed(1)}
                  </Text>

                  <StarRating rating={Math.round(promedioCalificacion)} />
                  <Text style={{ paddingBottom: 20 }}>
                    {totalComentarios} opiniones
                  </Text>

                  <TouchableOpacity style={styles.botonComentario}>
                    <Icon name="comment" size={15} color="#74C0FC" />
                    <Text style={styles.botonTexto}>Dejar comentario</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <ScrollView>
                  {comentarios.map((item) => {
                    return <RenderComentario item={item} key={item.id} />;
                  })}
                </ScrollView>
              </View>
            </ScrollView>
          </TabView.Item>
        </TabView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Open-Sans",
    margin: 10,
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
  },

  barraCalificacionRelleno: {
    height: "80%",
    backgroundColor: "#f4b400",
    borderRadius: 5,
    margin: 1,
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
    margin: 3,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
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
