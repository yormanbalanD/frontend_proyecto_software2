import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Zocial from '@expo/vector-icons/Zocial';

const DenunciasScreen = () => {
  const router = useRouter();

  // Estado con las denuncias
  const [denuncias, setDenuncias] = useState([
    { id: "1", local: "Arturo’s", usuario: "Saray Hernández", razon: "Estafa", comentario: "a" },
    { id: "2", local: "McDonalds", usuario: "Fariana Fuentes", razon: "Sanidad", comentario: "p" },
  ]);

  // Función para eliminar una denuncia al bloquear u omitir
  const handleAction = (id) => {
    setDenuncias(denuncias.filter((denuncia) => denuncia.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/mainpage")}>
          <Image source={require("@/assets/images/backButtonLocal.png")} style={styles.backButton} />
        </TouchableOpacity>
        <Image source={require("@/assets/images/Logo.png")} style={styles.logo} />
        <Text style={styles.title}>FOODIGO</Text>
      </View>
      
      <Text style={styles.heading}>DENUNCIAS</Text>
      <Text style={styles.subheading}>Locales</Text>
      <View style={styles.separator} />

      {/* Lista de denuncias */}
      <FlatList
        data={denuncias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.textContainer}>
                <View style={styles.iconCircle}>
                  <FontAwesome name="home" size={12} color="white" />
                </View> 
                <Text><Text style={styles.bold}>Local:</Text> {item.local}</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.iconCircle}>
                  <FontAwesome name="user" size={12} color="white" />
                </View> 
                <Text><Text style={styles.bold}>Usuario:</Text> {item.usuario}</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.iconCircle}>
                  <FontAwesome name="question" size={12} color="white" />
                </View> 
                <Text><Text style={styles.bold}>Razón:</Text> {item.razon}</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.iconCircle}>
                  <Zocial name="email" size={12} color="white" />
                </View> 
                <Text><Text style={styles.bold}>Comentario:</Text> {item.comentario}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.blockButton} onPress={() => handleAction(item.id)}>
                <Text style={styles.buttonText}>Bloquear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.omitButton} onPress={() => handleAction(item.id)}>
                <Text style={styles.buttonText}>Omitir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    width: 35,
    height: 35,
    marginRight: 15,
  },
  logo: {
    width: 30,
    height: 39,
    marginRight: 1,
  },
  title: {
    fontFamily: "League-Gothic",
    fontSize: 32,
    color: "black",
  },
  heading: {
    fontFamily: "Helios-Bold",
    fontSize: 24,
    color: "#black",
    marginVertical: 10,
    marginLeft: 20,
  },
  subheading: {
    fontSize: 14,
    fontFamily: "Times New Roman",
    color: "black",
    marginBottom: 10,
    marginLeft: 20,
    
  },
  separator: {
    height: 1.5,
    backgroundColor: "gray",
    width: "100%",
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  blockButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  omitButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  iconCircle: {
    backgroundColor: "#900d05",
    borderRadius: 16,
    padding: 4,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
});

export default DenunciasScreen;
