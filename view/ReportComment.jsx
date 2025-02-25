import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState } from "react";

export default function ReportComment() {
  const [text, onChangeText] = useState("");
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      height: "80vh",
      justifyContent: "center",
      itemsAlign: "center",
    },
    containerCard: {
      marginLeft: 50,
      marginRight: 50,
      alignItems: "center",
      height: "50vh",
      backgroundColor: "#fff9f1",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#8c0e02",
      height: "40px",
      width: "100%",
    },
    headerText: {
      color: "white",
      fontSize: "17px",
      fontWeight: "bold",
    },
    button: {
      borderRadius: 2,
      textAlign: "center",
      color: "white",
      width: 90,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
    },
    input: {
      width: "100%",
      height: 30,
      borderWidth: 0.2,
      fontSize: 8,
      paddingLeft: 16,
    },
    checkbox: {
      width: 6,
      height: 6,
      borderWidth: 1,
      borderColor: "#545351",
      borderRadius: 8,
      backgroundColor: "#545351",
    },
    checkboxText: {
      fontSize: 10,
      color: "#1e1b17",
    },
    checkboxChecked: {
      backgroundColor: "#1f6bdc",
    },
    checkboxContainer: {
      marginLeft: "20%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
  });

  const renderCheckbox = (checked, setChecked, label) => (
    <Pressable
      style={styles.checkboxContainer}
      onPress={() => setChecked(!checked)}
    >
      <View
        style={{
          width: 15,
          height: 15,
          borderWidth: 1,
          borderColor: "#545351",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
        }}
      >
        <View
          style={[styles.checkbox, checked && styles.checkboxChecked]}
        ></View>
      </View>

      <Text style={styles.checkboxText}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Denunciar este comentario</Text>
        </View>

        <View
          style={{
            width: "100%",
            paddingLeft: 15,
            marginTop: 16,
            display: "flex",
            itemsAlign: "center",
            justifyContent: "center",
          }}
        >
          {renderCheckbox(checked1, setChecked1, "Contenido inapropiado")}
          {renderCheckbox(checked2, setChecked2, "Negocio Engañoso")}
          {renderCheckbox(checked3, setChecked3, "Estafa")}
          {renderCheckbox(checked4, setChecked4, "Contenido Sexual")}
        </View>

        <View
          style={{
            display: "flex",
            width: "100%",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text
            style={{ fontWeight: "normal", fontSize: 10, marginBottom: 15, marginTop: 15 }}
          >
            Comentario
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="Comparte detalles sobre tu denuncia (opcional)"
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            marginTop: 30,
          }}
        >
          <Pressable style={styles.button}>
            <Text
              style={{ color: "#545351", fontWeight: "bold", fontSize: 12 }}
            >
              Cancelar
            </Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text
              style={{ color: "#545351", fontWeight: "bold", fontSize: 12 }}
            >
              Denunciar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
