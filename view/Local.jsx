import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import Like from "@/components/reactions/Like";
import Comment from "@/components/reactions/Comment";
import Shared from "@/components/reactions/Shared";
import Start from "@/components/reactions/Stars";
import NextInputIcon from "@/components/NextInputIcon";
// import { Shadow } from "react-native-shadow-2";
import { useState } from "react";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
// import { Rating } from "@rneui/themed";
import Icon from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";

const Local = () => {
  const router = useRouter();
  const [inputShow, setInputShow] = useState(false);
  const [showStartTotal, setshowStartTotal] = useState(false);

  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating);
  };

  return (
    <SafeAreaView style={{ flex: 1, width: "100%" }}>
      <View style={{
        position: "absolute",
        top: 55,
        left: 30,
        zIndex: 10,
      }}>
        <Pressable
          style={({ pressed }) => [
            {
              padding: 8,
              borderRadius: 50,
              backgroundColor: Colors.whiteTransparent,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => {
            router.push("/mainpage");
          }}
        >
          <Icon
            name="chevron-thin-down"
            size={17}
            style={{
              transform: [{ rotate: "90deg" }],
            }}
            color="white"
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverPage}>
          <ImageBackground
            source={require("./../assets/images/cover-page.png")}
            style={styles.coverPageImage}
            imageStyle={styles.coverPageImage}
          />
        </View>

        <View style={styles.containerContent}>
          <View style={styles.content}>
            <View style={styles.icons}>
              <View style={styles.RactionsDirections}>
                <Like />
                <Text style={styles.textReaction}>15</Text>
              </View>
              <View style={styles.RactionsDirections}>
                <Comment />
                <Text style={styles.textReaction}>02</Text>
              </View>
              <View style={styles.RactionsDirections}>
                <Shared />
                <Text style={styles.textReaction}>03</Text>
              </View>

              <View
                style={{
                  flexDirection: "col",
                  gap: 8,
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {showStartTotal && (
                  <View
                    style={{
                      flexDirection: "row",
                      position: "absolute",
                      bottom: 20,
                      transform: [{ scale: 0.45 }],
                    }}
                  >
                    <Rating
                      type="heart"
                      ratingCount={5}
                      fractions={2}
                      startingValue={1}
                      imageSize={20}
                      onFinishRating={ratingCompleted}
                      showRating
                      style={{ transform: [{ scale: 0.1 }] }}
                    />
                  </View>
                )}
                <Pressable
                  onPress={() => {
                    setshowStartTotal(!showStartTotal);
                  }}
                  style={styles.RactionsDirections}
                >
                  <Start style={{ transform: [{ rotate: "90deg" }] }} />
                  <Text style={styles.textReaction}>8.5</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.dataDirections}
              onPress={() => {
                setInputShow(!inputShow);
              }}
            >
              <Text style={{ fontSize: 18, color: "white" }}>
                Nombre del Local seleccionado
              </Text>
              {inputShow ? (
                <>
                  <View style={{ marginTop: 5, marginBottom: -10 }}>
                    <Text style={styles.titleInput}>
                      Queremos saber tu opinion
                    </Text>
                  </View>

                  <View style={styles.inputContent}>
                    <View
                      style={{
                        borderRadius: 100,
                        width: 28,
                        height: 28,
                        backgroundColor: Colors.lightGray,
                      }}
                    >
                      <Image
                        source={require("@/assets/images/avatarPrueba.png")}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 100,
                        }}
                      />
                    </View>

                    <TextInput
                      placeholder="Comentar"
                      style={styles.input}
                      placeholderTextColor={Colors.lightGray}
                    />
                    <Pressable
                      onPress={() => {
                        console.log("enviado");
                      }}
                    >
                      <NextInputIcon />
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <View style={{ gap: 8 }}>
                    <Text style={styles.textInfo}>
                      Dirección: Av. cualquiera, calle 22, centro comercial X,
                      local 001.
                    </Text>
                    <Text style={styles.textInfo}>
                      Coordenadas: 12.34442;23.22201
                    </Text>
                  </View>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  coverPage: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  coverPageImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  containerContent: {
    height: "50%",
    backgroundColor: Colors.primary,
  },
  content: {
    display: "flex",
    flex: 1,
    height: "100%",
    margin: 20,
    gap: 30,
  },
  dataDirections: {
    gap: 22,
    flexWrap: "wrap",
    height: "auto",
  },
  icons: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  RactionsDirections: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  textReaction: {
    fontSize: 13,
    color: Colors.white,
  },
  textInfo: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: "normal",
  },
  inputContent: {
    position: "relative",
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    fontSize: 9,
    color: Colors.lightGray,
  },
  titleInput: {
    fontSize: 13,
    color: Colors.white,
  },
});

export default Local;
