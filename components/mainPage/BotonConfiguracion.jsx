import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";

const BotonConfiguracion = ({ onPress }) => {
  return (
    
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} >
        <Image
          source={require("@/assets/images/config.png")}
          style={{ width: 26, height: 26 }}
        />
        </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 25,
    right: 10,
    padding: 10,
  },
});

export default BotonConfiguracion;
