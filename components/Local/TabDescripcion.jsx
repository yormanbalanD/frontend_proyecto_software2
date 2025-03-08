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
import PlaceholderText from "../PlaceholderText";
import PlaceholderFoto from "../PlaceHolderFoto";

const renderImagen = ({ item }) => {
  return (
    <View style={styles.imageLocalContainer}>
      <Image source={item} style={styles.image} />
    </View>
  );
};

export default function TabDescripcion({ restaurante }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const sigImagen = () => {
    const nextIndex =
      currentIndex < flatListRef.current.props.data.length - 1
        ? currentIndex + 1
        : 0;
    console.log(nextIndex);
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const antImagen = () => {
    const prevIndex =
      currentIndex > 0
        ? currentIndex - 1
        : flatListRef.current.props.data.length - 1;
    setCurrentIndex(prevIndex);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  return (
    <TabView.Item>
      <ScrollView horizontal={false} style={{}}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 20,
            gap: 10,
          }}
        >
          <View style={styles.descripcion}>
            {!restaurante.description ? (
              <View style={{ width: "100%", gap: 6 }}>
                <PlaceholderText width={"80%"} fontSize={16} />
                <PlaceholderText width={"95%"} fontSize={16} />
                <PlaceholderText width={"87%"} fontSize={16} />
                <PlaceholderText width={"50%"} fontSize={16} />
              </View>
            ) : (
              <Text
                style={{ ...styles.descripcion, padding: 0, marginLeft: 0 }}
              >
                {restaurante.description}
              </Text>
            )}
          </View>
          <View style={styles.descripcion}>
            <Icon name="map-marker" size={35} color="#8c0e03" />
            {!restaurante.description ? (
              <PlaceholderText width={200} fontSize={16} />
            ) : (
              <Text style={styles.descripcion}>
                {restaurante.latitude}, {restaurante.longitude}
              </Text>
            )}
          </View>
          <View style={styles.descripcion}>
            <Icon name="location-arrow" size={27} color="#8c0e03" />
            {!restaurante.description ? (
              <PlaceholderText width={"89%"} fontSize={16} />
            ) : (
              <Text style={styles.descripcion}>{restaurante.address}</Text>
            )}
          </View>

          <Text style={styles.fototexto}>Fotos</Text>
          <View style={styles.fotoHeader}>
            {restaurante.fotos && restaurante.fotos.length == 0 && (
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 17,
                  fontStyle: "italic",
                  textDecorationLine: "underline",
                }}
              >
                El restaurante no tiene fotos extra.
              </Text>
            )}

            {restaurante.fotos && restaurante.fotos.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.botonFlecha}
                  onPress={antImagen}
                >
                  <Icon name="chevron-left" size={20} color="#fff" />
                </TouchableOpacity>
                <FlatList
                  ref={flatListRef}
                  data={restaurante.fotos}
                  renderItem={renderImagen}
                  keyExtractor={(item) => item.slice(0, 100)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.lista}
                />
                <TouchableOpacity
                  style={styles.botonFlecha}
                  onPress={sigImagen}
                >
                  <Icon name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}

            {!restaurante.fotos && (
              <>
                <TouchableOpacity
                  style={styles.botonFlecha}
                  onPress={antImagen}
                >
                  <Icon name="chevron-left" size={20} color="#fff" />
                </TouchableOpacity>
                <FlatList
                  ref={flatListRef}
                  data={[
                    "placeholderFoto1",
                    "placeholderFoto2",
                    "placeholderFoto3",
                    "placeholderFoto4",
                    "placeholderFoto5",
                    "placeholderFoto6",
                    "placeholderFoto7",
                    "placeholderFoto8",
                    "placeholderFoto9",
                    "placeholderFoto10",
                  ]}
                  renderItem={() => (
                    <PlaceholderFoto
                      width={100}
                      height={100}
                      style={{ marginRight: 10 }}
                    />
                  )}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.lista}
                />
                <TouchableOpacity
                  style={styles.botonFlecha}
                  onPress={sigImagen}
                >
                  <Icon name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </TabView.Item>
  );
}

const styles = StyleSheet.create({
  descripcion: {
    fontSize: 16,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  fototexto: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  fotoHeader: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  lista: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    color: "black",
    backgroundColor: "currentColor",
  },
  image: {
    marginTop: 10,
    width: 100,
    height: 100,
    objectFit: "cover",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000070",
  },
  botonFlecha: {
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 50,
    backgroundColor: "#8c0e03",
  },
});
