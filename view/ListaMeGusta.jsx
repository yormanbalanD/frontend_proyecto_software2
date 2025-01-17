import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Obtener dimensiones de la pantalla para el diseño responsivo
const { width } = Dimensions.get('window');

export default function ListaMeGusta() {
  /*
  Aqui se deberia implementar una logica con un ciclo for para obtener los datos de la base de datos
  y asi mostrar los locales que ha visitado el usuario en base a las variables predefinidas,
  por ahora se muestra un arreglo de objetos insertados manualmente. 
  */
  const data = [
    {
      name: 'Nombre del Local seleccionado',
      address: 'Av. cualquiera, calle 22, centro comercial X, local 002.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg', // Reemplazar con URL real
    },
    {
      name: 'Nombre del Local seleccionado',
      address: 'Av. cualquiera, calle 22, centro comercial X, local 002.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg', // Reemplazar con URL real
    },
    {
      name: 'Nombre del Local seleccionado',
      address: 'Av. cualquiera, calle 22, centro comercial X, local 002.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg', // Reemplazar con URL real
    },
    {
      name: 'Nombre del Local seleccionado',
      address: 'Av. cualquiera, calle 22, centro comercial X, local 002.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg', // Reemplazar con URL real
    },
   
  ];

  // Estados para controlar los iconos de like y star, al presionar estos iconos se cambia su estado de activo a inactivo
  // Es decir Corazon vacio corazon lleno, Estrella Vacia Estrella Llena
  const [liked, setLiked] = useState(Array(data.length).fill(true)); //Dado que es la lista de me gusta inicialmente esta presionado
  const [starred, setStarred] = useState(Array(data.length).fill(false));

  const toggleLike = (index) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  const toggleStar = (index) => {
    const newStarred = [...starred];
    newStarred[index] = !newStarred[index];
    setStarred(newStarred);
  };

  // Funciones para manejar los eventos de presionar los iconos de like, comment y share
  const handleCommentPress = () => {
    console.log('Comment pressed');
  };

  const handleSharePress = () => {
    console.log('Share pressed');
  };

  const handleCardPress = () => {
    console.log('Card pressed');
  };

  // Variable para controlar el estado de desplazamiento del scroll
  let isScrolling = false;

  const handleScrollBegin = () => {
    isScrolling = true;
  };

  const handleScrollEnd = () => {
    isScrolling = false;
  };

  const handleCardPressWrapper = () => {
    if (!isScrolling) {
      handleCardPress();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Lista de me gusta
      </Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        onMomentumScrollBegin={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity style={styles.cardContent} onPress={handleCardPressWrapper}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardAddress}>
                  {item.address}
                </Text>
                <View style={styles.icons}>
                  <TouchableOpacity onPress={() => toggleLike(index)}>
                    <FontAwesome
                      name={liked[index] ? "heart" : "heart-o"}
                      size={24} 
                      color="red"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCommentPress}>
                    <FontAwesome name="comment" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSharePress}>
                    <FontAwesome name="share" size={24} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleStar(index)}>
                    <FontAwesome
                      name={starred[index] ? "star" : "star-o"}
                      size={24} 
                      color="gold"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#034752', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9, 
    alignSelf: 'center', 
    minHeight: 150, 
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center', 
    flexWrap: 'nowrap', 
    flex: 1, 
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardAddress: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
    flexShrink: 1, 
    flexWrap: 'wrap', 
    width: '100%',
    overflow: 'hidden',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    marginTop: 10,
    width: '90%',
  },
  cardImage: {
    width: width * 0.25,
    height: width * 0.25, 
    borderRadius: 10,
    marginRight: 10,
  },
});
