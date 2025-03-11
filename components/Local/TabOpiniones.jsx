import React, { useEffect, useRef, useState } from "react";
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
import StarRating from "./StarRating";
import PlaceholderFotoPerfil from "../PlaceholderFotoPerfil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode as decode } from "jwt-decode";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import PlaceholderText from "../PlaceholderText";

function RenderComentario({ item, setModal, setComentarioADenunciar }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [denunciarVisible, setDenunciarVisible] = useState(false);
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
        <Text style={styles.nombreCc}>{item.userName}</Text>
        <Text style={styles.comentario}>{item.comment}</Text>
        <StarRating rating={item.calification} />
      </View>
      <View style={styles.logoContainerComent}>
        {fotoPerfil == null ? (
          <PlaceholderFotoPerfil size={60} fontSize={50} />
        ) : (
          <Image
            source={
              !fotoPerfil.startsWith("data:image")
                ? require("@/assets/images/avatarPrueba.png")
                : { uri: fotoPerfil }
            }
            style={styles.fotoPerfil}
          />
        )}
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 10,
          top: 9,
        }}
        onPress={() => {
          setDenunciarVisible(!denunciarVisible);
        }}
      >
        <SimpleLineIcons name="options" size={24} color="white" />
      </TouchableOpacity>
      {denunciarVisible && (
        <TouchableOpacity
          onPress={() => {
            setDenunciarVisible(false);
            setModal(true);
            setComentarioADenunciar(item);
          }}
          style={{
            position: "absolute",
            top: 5,
            right: 38,
            borderWidth: 1,
            borderColor: "#00000098",
            borderRadius: 4,
            paddingVertical: 15,
            paddingHorizontal: 20,
            backgroundColor: "#FFF",
          }}
        >
          <Text style={{ fontWeight: 500 }}>Denunciar Comentario</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const RatingBar = ({ rating, count, totalReviews }) => {
  return (
    <View style={styles.ratingBarContainer}>
      <Text style={styles.ratingText}>{rating}</Text>
      <View style={styles.barraCalificacionFondo}>
        <View
          style={[
            styles.barraCalificacionRelleno,
            { width: count > 0 ? `${(count / totalReviews) * 100}%` : 0 },
          ]}
        />
      </View>
    </View>
  );
};

export default function TabOpiniones({
  restaurante,
  setModalCrearComentarioVisible,
  setModalEditarComentarioVisible,
  setComentarioAEditar,
  setModalReportComentario,
  setComentarioADenunciar,
}) {
  const [comentarios, setComentarios] = useState([]);
  const [idUser, setIdUser] = useState(null);

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
    setIdUser(decoded.sub);
    return decoded.sub;
  };

  const getUserTypo = async () => {
    const token = await getToken();
    if (!token) return null;

    const decoded = decode(token);
    return decoded.sub;
  };

  useEffect(() => {
    if (!restaurante.reviews) return;
    setComentarios(restaurante.reviews);
    getUserId();
  }, [restaurante]);

  return (
    <TabView.Item style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.total}>
          <View style={styles.CalificacionDistribucionContainer}>
            <RatingBar
              rating={5}
              count={
                comentarios.filter((item) => item.calification == 5).length
              }
              totalReviews={comentarios.length}
            />
            <RatingBar
              rating={4}
              count={
                comentarios.filter((item) => item.calification == 4).length
              }
              totalReviews={comentarios.length}
            />
            <RatingBar
              rating={3}
              count={
                comentarios.filter((item) => item.calification == 3).length
              }
              totalReviews={comentarios.length}
            />
            <RatingBar
              rating={2}
              count={
                comentarios.filter((item) => item.calification == 2).length
              }
              totalReviews={comentarios.length}
            />
            <RatingBar
              rating={1}
              count={
                comentarios.filter((item) => item.calification == 1).length
              }
              totalReviews={comentarios.length}
            />
          </View>

          <View style={styles.puntuacionContainer}>
            {restaurante.description ? (
              <Text style={{ fontSize: 40, margin: 0, lineHeight: 45 }}>
                {comentarios.length > 0 &&
                  (
                    comentarios.reduce(
                      (a, b) => parseInt(a) + parseInt(b.calification),
                      0
                    ) / comentarios.length
                  ).toFixed(1)}
                {comentarios.length == 0 && "0"}
              </Text>
            ) : (
              <PlaceholderText width={10} fontSize={40} />
            )}

            <StarRating
              rating={Math.round(
                comentarios.length > 0
                  ? (
                      comentarios.reduce(
                        (a, b) => parseInt(a) + parseInt(b.calification),
                        0
                      ) / comentarios.length
                    ).toFixed(1)
                  : 0
              )}
            />
            {restaurante.description ? (
              <Text style={{ paddingBottom: 20 }}>
                {comentarios.length} opiniones
              </Text>
            ) : (
              <PlaceholderText width={50} fontSize={13} />
            )}

            {comentarios.filter(async (item) => item.idUser == idUser).length >
            0 ? (
              <TouchableOpacity
                onPress={() => {
                  setComentarioAEditar(
                    comentarios.filter(async (item) => item.idUser == idUser)[0]
                  );
                  setModalEditarComentarioVisible(true);
                }}
                style={styles.botonComentario}
              >
                <Icon name="comment" size={15} color="#74C0FC" />
                <Text style={styles.botonTexto}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setModalCrearComentarioVisible(true)}
                style={styles.botonComentario}
              >
                <Icon name="comment" size={15} color="#74C0FC" />
                <Text style={styles.botonTexto}>Comentar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View>
          <ScrollView>
            {comentarios.map((item, index) => {
              return (
                <RenderComentario
                  setComentarioADenunciar={setComentarioADenunciar}
                  setModal={setModalReportComentario}
                  item={item}
                  key={item._id + index}
                />
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </TabView.Item>
  );
}

const styles = StyleSheet.create({
  CalificacionDistribucionContainer: {
    flex: 1.4,
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
  total: {
    flexDirection: "row",
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#00000029",
    paddingVertical: 13,
    paddingHorizontal: 10,
    flex: 1,
  },
  puntuacionContainer: {
    alignItems: "center",
    flex: 1,
  },
  ratingText: {
    marginRight: 8,
    fontSize: 16,
    alignItems: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#8c0e03",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000000ac",
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 10,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  logoContainerComent: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
  },
  cardTexto: {
    justifyContent: "center",
    // alignItems: "center",
    flex: 1,
  },
  nombreCc: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  comentario: {
    fontSize: 14,
    color: "#fff",
  },
  botonComentario: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 17,
    borderColor: "gray",
    gap: 4,
    flexDirection: "row",
  },
  botonTexto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  fotoPerfil: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
  },
});
