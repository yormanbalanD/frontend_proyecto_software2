import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";

export default function ModalNotificacion({ isVisible, isSuccess, message, onClose }) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
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
                {message}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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