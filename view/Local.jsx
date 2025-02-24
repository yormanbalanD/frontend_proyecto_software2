import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import * as Font from "expo-font";
import { Tab, TabView, Icon } from "@rneui/themed";

const Local = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  const comentarios = [
    {
      id: "1",
      nombre: "Ana Perez",
      comentario: "Excelente comida y servicio!",
      calificacion: 5,
      fotoPerfil: require("../assets/images/avatarPrueba.png"),
    },
    {
      id: "2",
      nombre: "Carlos Gomez",
      comentario: "Buena atencion, pero algo lenta.",
      calificacion: 4,
      fotoPerfil: require("../assets/images/avatarPrueba.png"),
    },
    {
      id: "3",
      nombre: "Laura Rivas",
      comentario: "El ambiente es agradable, pero la comida podria mejorar.",
      calificacion: 3,
      fotoPerfil: require("../assets/images/avatarPrueba.png"),
    },
    {
      id: "4",
      nombre: "Laura Rivaero",
      comentario: "El ambiente es bueno. Me gusta. ",
      calificacion: 5,
      fotoPerfil: require("../assets/images/avatarPrueba.png"),
    },
  ];

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

  const renderComentario = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTexto}>
        <Text style={styles.comentario}>{item.comentario}</Text>
        <Text style={styles.nombreCc}>{item.nombre}</Text>
        <StarRating rating={item.calificacion} />
      </View>
      <View style={styles.logoContainerComent}>
        <Image source={item.fotoPerfil} style={styles.logoImage} />
      </View>
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
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="chevron-left"
            type="font-awesome"
            size={35}
            color="#8c0e03"
          />
          <Image
            source={require("../assets/images/logo_recortado.png")}
            style={styles.logo}
          />
          <Text style={styles.titulo}>FOODIGO</Text>
        </View>

        <View style={styles.restauranteInfo}>
          <Text style={styles.restauranteNombre}>McDonald's</Text>
          <Text style={styles.restauranteTipo}>
            Restaurante de comida rapida
          </Text>
          <View style={styles.seccion}>
            <Icon
              name="heart"
              type="font-awesome"
              size={30}
              color="#8c0e03"
              style={styles.iconos}
            />
            <Icon
              name="comments"
              type="font-awesome"
              size={30}
              color="#2199e4"
              style={styles.iconos}
            />
            <Text style={styles.ratingText}>{totalComentarios}</Text>
            <Icon
              name="star"
              type="font-awesome"
              size={30}
              color="#e4dd21"
              style={styles.iconos}
            />
            <Text style={styles.ratingText}>
              {promedioCalificacion.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.imageLogoContainer}>
          <Image
            source={require("../assets/images/local3.jpg")}
            style={styles.fixedImage}
          />

          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/McDonald's_logo.svg.png")}
              style={styles.circularLogo}
            />
          </View>
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
          <TabView.Item style={styles.tabVista}>
            <View style={{ paddingBottom: 0 }}>
              <View style={styles.descripcion}>
                <Icon
                  name="map-marker"
                  type="font-awesome"
                  size={35}
                  color="#8c0e03"
                />
                <Text style={styles.descripcion}>
                  Ciudad Guayana 8050, Bolivar.
                  <br />
                  Ubicado en: Centro Comercial Costa America.
                </Text>
              </View>
              <View style={styles.descripcion}>
                <Icon
                  name="phone"
                  type="font-awesome"
                  size={35}
                  color="#8c0e03"
                />
                <Text style={styles.descripcion}>0286-9221100</Text>
              </View>
              <View style={styles.descripcion}>
                <Icon
                  name="location-arrow"
                  type="font-awesome"
                  size={35}
                  color="#8c0e03"
                />
                <Text style={styles.descripcion}>
                  874G+3P Ciudad Guayana, Bolivar
                </Text>
              </View>

              <Text style={styles.fototexto}>Fotos</Text>
              <View style={styles.fotoHeader}>
                <TouchableOpacity onPress={antImagen}>
                  <Icon
                    name="chevron-circle-left"
                    type="font-awesome"
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
          </TabView.Item>

          {/* Opiniones */}
          <TabView.Item style={styles.tabVista}>
            <View>
              <View style={styles.container}>
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

                    <TouchableOpacity
                      style={styles.botonComentario}
                      // onPress={{}}
                    >
                      <Icon
                        name="comment"
                        type="font-awesome"
                        size={15}
                        color="#74C0FC"
                      />
                      <Text style={styles.botonTexto}>Dejar comentario</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ margin: 10 }}>
                  <FlatList
                    data={comentarios}
                    keyExtractor={(item) => item.id}
                    renderItem={renderComentario}
                  />
                </View>
              </View>
            </View>
          </TabView.Item>
        </TabView>
      </View>
    </ScrollView>
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
    marginRight: 5,
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
    marginHorizontal: 5,
    fontSize: 16,
    alignItems: "center",
    fontWeight: "bold",
  },

  tabVista: {
    flex: 1,
    width: "100%",
    padding: 10,
  },

  tabvistas: {
    margin: 10,
    marginLeft: 50,
    marginRight: 50,
  },

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
    calificacion: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 5,
    },
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
    flex: "wrap",
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
});

export default Local;
