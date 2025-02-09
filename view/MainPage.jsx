import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsideMainPage from "../components/mainPage/AsideMainPage";
import BotonBurguer from "../components/mainPage/BotonBurguer";
import Colors from "../constants/Colors";
import CameraMain from "../components/mainPage/cameraMain";

export default function MainPage() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ height: "100%", backgroundColor: Colors.primary }}>
      <AsideMainPage visible={visible} />
      <CameraMain />
      <BotonBurguer
        onPress={() => {
          setVisible(!visible);
        }}
      />
    </View>
  );
}
