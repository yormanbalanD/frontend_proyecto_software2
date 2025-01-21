import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const BotonBurguer = ({ onPress }) => {
  return (
    <View style={styles.container} > 
      <TouchableOpacity onPress={onPress}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  line: {
    width: 30, 
    height: 5, 
    backgroundColor: 'white', 
    marginVertical: 2, 
    borderRadius: 10, 
    elevation: 3,
    shadowColor: "black",
  },
});

export default BotonBurguer;
