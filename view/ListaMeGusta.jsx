import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import * as Font from 'expo-font';

const restaurants = [
  {
    id: "1",
    name: "Arturo's",
    address: "C.C. Santo Tome IV planta baja local #13, Av Guayana, Ciudad Guayana 8050, Bolívar.",
    comments: 18,
    rating: 3.7,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
  },
  {
    id: "2",
    name: "Restaurant Manos Criollas",
    address: "77JH+5CF, C. Argelia, Ciudad Guayana 8050, Bolívar.",
    comments: 29,
    rating: 4.8,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
  },
];

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [liked, setLiked] = useState(restaurants.map(() => true)); // Set initial state to true for all items

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'League_Gothic': require('../assets/fonts/LeagueGothic-Regular.ttf'),
        'Helios': require('../assets/fonts/SpaceMono-Regular.ttf'),
        'Open_Sans': require('../assets/fonts/OpenSans-Regular.ttf'),
        'Montserrat': require('../assets/fonts/Montserrat-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const toggleLike = (index) => {
    setLiked((prevLiked) => {
      const newLiked = [...prevLiked];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <ImageBackground source={require('../assets/images/historial (2).png')} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.backIcon}>
            <Image source={require('../assets/images/asidemainbutton.png')} style={styles.customIcon} />
          </TouchableOpacity>
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>FOODIGO</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleShadow}>.</Text>
          <Text style={styles.title}>ME GUSTA</Text>
        </View>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.icon} onPress={() => toggleLike(index)}>
                    <Ionicons name={liked[index] ? "heart" : "heart-outline"} size={24} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.icon}>
                    <Ionicons name="chatbubble" size={20} color="#019eed" />
                    <Text style={styles.count}>{item.comments}</Text>
                  </TouchableOpacity>
                  <Ionicons name="star" size={20} color="gold" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
              </View>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  iconRow: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 20,
    alignItems: "center",
  },
  backIcon: {
    marginRight: 5,
  },
  customIcon: {
    width: 60,
    height: 60,
    transform: [{ rotate: '90deg' }],
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    fontFamily: "League_Gothic", // Use custom font
    letterSpacing: -5,
  },
  titleContainer: {
    alignItems: "flex-start",
    marginTop: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    position: "absolute",
    paddingLeft: 30,
    fontFamily: "Helios", // Use another custom font
  },
  titleShadow: {
    fontSize: 26,
    color: "transparent",
    textAlign: "left",
    textShadowColor: "white",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add space between info and image
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 2,
    marginLeft: 10, // Add margin to the left of the image
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "serif",
    fontFamily: "Open_Sans", // Use another
    },

  address: {
    fontSize: 14,
    color: "black",
    marginBottom: 5,
    fontFamily: "Open_Sans", 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  count: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily: "Open_Sans", 
  },
  rating: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: "Open_Sans", 
  },
});