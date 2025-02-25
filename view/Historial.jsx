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

export default function Historial() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
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

  const getHistorial = async () => {
    const response = await fetch(
      "https://backend-swii.vercel.app/api/getRestaurantsShowed/" + getUserId(),
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
      console.log(data);
      setRestaurants(data.restaurants);
    }
  };

  useEffect(() => {
    getHistorial();
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

      <ScrollView style={styles.list}>
        <Text style={styles.historialTitle}>HISTORIAL</Text>
        {restaurants.map((restaurant, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{restaurant.name}</Text>
              <Text style={styles.cardAddress}>
                {restaurant.address.latitude}, {restaurant.address.longitude}
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
                {/* <Text style={styles.cardAddress}>{restaurant.comments}</Text> */}
                <Image
                  source={require("@/assets/images/icono_de_calificacion-removebg-preview.png")}
                  style={styles.icon}
                />
                {/* <Text style={styles.cardAddress}>{restaurant.rating}</Text> */}
              </View>
            </View>
            <View style={styles.boxImage}>
              <Image source={{ uri: `data:image/png;base64,${restaurant.fotoPerfil}` }} style={styles.cardImage} />
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
});
