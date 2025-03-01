import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import ModalCrearLocal from "../components/ModalCrearLocal";  
import Notificacion from "@/components/ModalNotificacion";
import { useCookies } from "react-cookie";
import { jwtDecode as decode } from "jwt-decode";

export default function LocalesPropios() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [notificacionVisible, setNotificacionVisible] = useState(false);
const [notificacionMensaje, setNotificacionMensaje] = useState("");
const [notificacionExito, setNotificacionExito] = useState(false);
const [loading, setLoading] = useState(true); 

  const getToken = () => {
    return cookies.token;
  };

  const getUserId = () => {
    const token = getToken();
    if (!token) return null;

    const decoded = decode(token);
    return decoded.sub;
  };

  const getLocalesPropios = async () => {
    const response = await fetch(
      "https://backend-swii.vercel.app/api/getRestaurants/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
      }
    );

    console.log(response);

    if (response.status === 200) {
      const data = await response.json();
      //console.log(data);
      // Procesamos los datos para agregar promedio de calificación y cantidad de comentarios
      const processedRestaurants = data.restaurantsFound.map((restaurant) => {
        const reviews = restaurant.reviews || []; // Si no tiene reviews, ponemos un array vacío
        const totalReviews = reviews.length;

        // Calcular promedio de calificación
        const totalCalification = restaurant.reviews.reduce((sum, review) => {
          const calification = Number(review.calification);
          return !isNaN(calification) ? sum + calification : sum;
        }, 0);

        const avgCalification =
          totalReviews > 0
            ? (totalCalification / totalReviews).toFixed(1)
            : "N/A";
        return {
          ...restaurant,
          avgCalification,
          totalReviews,
        };
      });
      setRestaurants(processedRestaurants);
    }
    setLoading(false); 
  };

  useEffect(() => {
    getLocalesPropios();
    console.log(getUserId());
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/historial (2).png")}
        style={styles.background}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/mainpage")}>
          <Image
            source={require("@/assets/images/icono_atras.png")}
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Image
          source={require("@/assets/images/logo_recortado.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>FOODIGO</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.localTitle}>LOCAL</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text
            style={styles.createButtonText}
            onPress={() => setModalVisible(true)}
          >
            Crear
          </Text>
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ): restaurants.length === 0 ? ( 
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No has visto ningún restaurante aún.</Text>
        </View>
      ) : (
      <ScrollView style={styles.list}>
          {restaurants.map((restaurant, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{restaurant.name}</Text>
                <Text style={styles.cardAddress}>{restaurant.address}</Text>
                <Text style={styles.cardAddress}>
                  {restaurant.latitude}, {restaurant.longitude}
                </Text>
                <View style={styles.cardFooter}>
                  <TouchableOpacity>
                    <Image
                      source={require("@/assets/images/icono_me_gusta-removebg-preview.png")}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <Image
                    source={require("@/assets/images/icono_comentario-removebg-preview.png")}
                    style={styles.icon}
                  />
                  {
                    <Text style={styles.cardAddress}>
                      {restaurant.totalReviews}
                    </Text>
                  }
                  <Image
                    source={require("@/assets/images/icono_de_calificacion-removebg-preview.png")}
                    style={styles.icon}
                  />
                  {
                    <Text style={styles.cardAddress}>
                      {restaurant.avgCalification}
                    </Text>
                  }
                </View>
              </View>
              <View style={[styles.boxImage, !restaurant.fotoPerfil && styles.placeholder]}>
                  {restaurant.fotoPerfil ? (
                <Image
                  source={{
                    uri: restaurant.fotoPerfil.startsWith("data:image")
                      ? restaurant.fotoPerfil
                      : `data:image/png;base64,${restaurant.fotoPerfil}`,
                  }}
                  style={styles.cardImage}
                />
              ) : (
                <Text style={styles.placeholderText}>Sin foto</Text>
              )}
              <View style={styles.borderImage}></View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
  )}
      <ModalCrearLocal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSuccess={(mensaje, esExito) => {
    setNotificacionMensaje(mensaje);
    setNotificacionExito(esExito);
    setNotificacionVisible(true);

    if (esExito) {
      getLocalesPropios(); // Recargar la lista de locales solo si fue exitoso
      setModalVisible(false); // Cerrar modal de creación
    }
  }}
/>

      <Notificacion
        isVisible={notificacionVisible}
        isSuccess={notificacionExito}
        message={notificacionMensaje}
        onClose={() => setNotificacionVisible(false)}
      />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  header: {
    marginLeft: 30,
    marginTop: 40,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBack: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  icon: {
    width: 18,
    height: 18,
    marginHorizontal: 3,
  },
  logo: {
    width: 20,
    height: 30,
    marginRight: 2,
  },
  title: {
    fontFamily: "League-Gothic",
    fontSize: 32,
    color: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  localTitle: {
    fontFamily: "Helios-Bold",
    fontSize: 24,
    color: "#fff",
    marginVertical: 15,
    marginLeft: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00bf62",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 5,
    fontFamily: "OpenSans-Bold",
  },
  list: {
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 7,
    overflow: "hidden",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
  },
  boxImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  borderImage: {
    width: "90%",
    height: "90%",
    position: "absolute",
    borderWidth: 4,
    borderColor: "#FFF",
  },
  cardContent: {
    width: "65%",
    marginRight: 20,
  },
  cardTitle: {
    fontFamily: "OpenSans-Bold",
    fontSize: 14,
    marginBottom: 5,
  },
  cardAddress: {
    fontFamily: "Open-Sans",
    fontSize: 9,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  placeholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ccc", // Fondo gris
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
