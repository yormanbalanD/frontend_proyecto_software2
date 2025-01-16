import React from "react";
import { View, Image, Pressable, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";

export default function BotonLogin() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <Pressable
        style={{
          backgroundColor: Colors.black,
          width: "min-content",
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 10,
          flex: 0,
        }}
      >
        <Image
          source={require("@/assets/images/icons-google-login.png")}
          style={{ width: 35, height: 35, marginRight: 10 }}
        />
        <Text
          style={{
            fontSize: 18,
            color: Colors.white,
          }}
        >
          Iniciar Sesion con Google
        </Text>
      </Pressable>
    </View>
  );
}
