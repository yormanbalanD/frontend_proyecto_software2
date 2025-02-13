import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsideMainPage from "../components/mainPage/AsideMainPage";
import BotonBurguer from "../components/mainPage/BotonBurguer";
import Colors from "../constants/Colors";
import CameraMain from "../components/mainPage/cameraMain";
import BotonConfiguracion from "../components/mainPage/BotonConfiguracion";

export default function MainPage() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ height: "100%", backgroundColor: Colors.primary }}>
      <CameraMain />
      <BotonBurguer
        onPress={() => {
          setVisible(!visible);
        }}
      />
      <BotonConfiguracion />
      <AsideMainPage setVisible={setVisible} visible={visible} />
    </View>
  );
}
