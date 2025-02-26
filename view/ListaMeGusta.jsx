import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useCookies } from "react-cookie";
import { jwtDecode as decode } from "jwt-decode";
import { FontAwesome } from "@expo/vector-icons";

export default function ListaMeGusta() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [liked, setLiked] = useState({});
  const [cookies] = useCookies(["token"]);

  const getToken = () => {
    return cookies.token;
  };

  const getUserId = () => {
    const token = getToken();
    if (!token) return null;

    const decoded = decode(token);
    return decoded.sub;
  };
  const user = "67bc92ed7b1d62946bdde7bf";
//https://backend-swii.vercel.app/api/deleteRestaurantFromLiked/ + user
  const getListaMegusta = async () => {
    const response = await fetch(
      
      "https://backend-swii.vercel.app/api/getRestaurantsLiked/" + user, //aqui iria el getUserId(), pero me retorna null
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", //aqui tmb iria tmb el getToken() pero retorna null tmb
          Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFETUlOMTIzQEdNQUlMLkNPTSIsInN1YiI6IjY3YmM5MmVkN2IxZDYyOTQ2YmRkZTdiZiIsImlhdCI6MTc0MDUyNTAzNn0.vSvsRgbNFAbVl43-fqAGeBsbb3PUbQG-dv4ngL0TG4U",
        },
      }
    );

    console.log(response);

    if (response.status === 200) {
      const data = await response.json();
      //console.log(data);
      // Procesamos los datos para agregar promedio de calificación y cantidad de comentarios
      const processedRestaurants = data.restaurants.map((restaurant) => {
        const reviews = restaurant.reviews || []; // Si no tiene reviews, ponemos un array vacío
        const totalReviews = reviews.length;
        
        // Calcular promedio de calificación
        console.log("Datos del restaurante:", restaurant.name, restaurant.reviews);
        const totalCalification = restaurant.reviews.reduce((sum, review) => {
          const calification = Number(review.calification); // Convertir a número
          return !isNaN(calification) ? sum + calification : sum;  // Sumar solo si es número válido
        }, 0);

        const avgCalification = totalReviews > 0 ? (totalCalification / totalReviews).toFixed(1) : "N/A";
        return { 
          ...restaurant, 
          avgCalification, 
          totalReviews 
        };
      }); 
      setRestaurants(processedRestaurants);
      // Initialize all hearts to be filled
      const initialLikedState = {};
      processedRestaurants.forEach((_, index) => {
        initialLikedState[index] = true;
      });
      setLiked(initialLikedState);
    }
  };

  useEffect(() => {
    getListaMegusta();
    console.log(getUserId());
  }, []);

  const toggleLike = async (index, restaurantId) => {
    const newLikedState = !liked[index];
    setLiked((prevLiked) => ({
      ...prevLiked,
      [index]: newLikedState,
    }));

    if (!newLikedState) {
      await fetch(
        "https://backend-swii.vercel.app/api/deleteRestaurantFromLiked/" + user,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFETUlOMTIzQEdNQUlMLkNPTSIsInN1YiI6IjY3YmM5MmVkN2IxZDYyOTQ2YmRkZTdiZiIsImlhdCI6MTc0MDUyNTAzNn0.vSvsRgbNFAbVl43-fqAGeBsbb3PUbQG-dv4ngL0TG4U",
          },
          body: JSON.stringify({ restaurantId }),
        }
      );
    }
  };

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

      <ScrollView style={styles.list}>
        <Text style={styles.historialTitle}>ME GUSTA</Text>
        {restaurants.map((restaurant, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{restaurant.name}</Text>
              <Text style={styles.cardAddress}>
                {restaurant.address}
              </Text>
              <View style={styles.cardFooter}>
                <TouchableOpacity onPress={() => toggleLike(index, restaurant._id)}>
                  <FontAwesome
                    name={liked[index] ? "heart" : "heart-o"}
                    size={18}
                    color="red"
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <Image 
                  source={require("@/assets/images/icono_comentario-removebg-preview.png")}
                  style={styles.icon}
                />
                {<Text style={styles.cardAddress}>{restaurant.totalReviews}</Text>}
                <Image
                  source={require("@/assets/images/icono_de_calificacion-removebg-preview.png")}
                  style={styles.icon}
                />
                { <Text style={styles.cardAddress}>{restaurant.avgCalification}</Text>}
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
  historialTitle: {
    fontFamily: "Helios-Bold",
    fontSize: 24,
    color: "#fff",
    marginVertical: 15,
    marginLeft: 20,
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
});