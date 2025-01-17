import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";

export default function ModalNotificacion() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = () => { // esta funcion es para simular el resultado del registro
    const randomSuccess = Math.random() > 0.5; //Aqui si es false sale error y si en true sale el mensaje de exito
    setIsSuccess(randomSuccess);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>{/* Este boton solo lo puse para simular la dinamica */}
        <Text style={styles.buttonText}>Registrar</Text>      
      </TouchableOpacity> 
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalRow}>
                <Image
                  source={
                    isSuccess
                      ? require("@/assets/images/check.png")
                      : require("@/assets/images/equis.png")
                  }
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>
                  {isSuccess
                    ? "Su registro se realizó exitosamente"
                    : "No se pudo completar su registro"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: { //borrar
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: { //borrar
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    elevation: 30,
    shadowColor: "black",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    height: 32,
    width: 32,
    marginRight: 10,
  },
  modalText: {
    fontSize: 12,
    textAlign: "center",
  },
});
