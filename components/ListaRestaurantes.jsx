import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function ListaRestaurantes({ restaurants, handleHeartPress }) {
  const router = useRouter();

  return (
    <ScrollView style={styles.list}>
      {restaurants.map((restaurant, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => router.push(`/local?restaurante=${restaurant._id}`)} >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{restaurant.name}</Text>
            <Text style={styles.cardAddress}>{restaurant.address}</Text>
            <View style={styles.cardFooter}>
            {restaurant.liked && (
              <TouchableOpacity onPress={() => handleHeartPress && handleHeartPress(index)}>
                <Image 
                  source={require("@/assets/images/icono_me_gusta-removebg-preview.png")} 
                  style={styles.icon} 
                />
                </TouchableOpacity>
              )}              
              <Image
                source={require("@/assets/images/icono_comentario-removebg-preview.png")}
                style={styles.icon}
              />
              <Text style={styles.cardAddress}>{restaurant.totalReviews}</Text>
              <Image
                source={require("@/assets/images/icono_de_calificacion-removebg-preview.png")}
                style={styles.icon}
              />
              <Text style={styles.cardAddress}>
                {restaurant.avgCalification}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.boxImage,
              !restaurant.fotoPerfil && styles.placeholder,
            ]}
          >
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
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  icon: {
    width: 18,
    height: 18,
    marginHorizontal: 3,
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
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#666",
  },
});
