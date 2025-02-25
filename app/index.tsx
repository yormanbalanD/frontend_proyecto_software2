import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import InitPage from "@/view/InitPage";
import MainPage from "@/view/MainPage";
import ListaMeGusta from "@/view/ListaMeGusta";
import Local from "@/view/Local";
import Perfil from "@/view/Perfil"
import Historial from "@/view/Historial"

export default function index() {
  // Comprobar si el usuario ya esta logeado

  //
  return (
    <>
      <InitPage />
    </>
  );
}
