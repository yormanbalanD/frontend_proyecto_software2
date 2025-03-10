import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState } from "react";

export default function ReportLocal({ idRestaurante }) {
  const [textComment, setTextComment] = useState("");
  const [selectedOption, setSelectedOption] = useState(null); 
  const [message, setMessage] = useState('')
  const [color, setColor] = useState("")
  const [token, setToken] = useState("")

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
  

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value != null) {
        return value;
      }
      setToken(value)
    } catch (e) {
      console.log(e);
      return null;
    }
  };

 useEffect(() => {
  getToken()
 }, [token])


  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const renderCheckbox = (option, label) => (
    <Pressable
      style={styles.checkboxContainer}
      onPress={() => handleOptionSelect(option)}
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
          style={[
            styles.checkbox,
            selectedOption === option && styles.checkboxChecked, 
          ]}
        ></View>
      </View>

      <Text style={styles.checkboxText}>{label}</Text>
    </Pressable>
  );

  const handleSubmit = async () => {
    if(selectedOption === null){
      setMessage("Selecciona el tipo de denuncia ")
      setColor("red")
    }
    
    try {
        await fetch(
        `https://backend-swii.vercel.app/api/denunciarRestaurante/${idRestaurante}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: {
            observacion: textComment,
            razon: selectedOption,
          },
        }
      );
      setColor("green")
      setMessage("Envio Exitoso")
    } catch (error) {
      setColor("red")
      setMessage("Ocurrio un error")
      throw new Error(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Denunciar este local</Text>
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
         {renderCheckbox("inapropiado", "Contenido inapropiado")}
            {renderCheckbox("engañoso", "Negocio Engañoso")}
            {renderCheckbox("estafa", "Estafa")}
            {renderCheckbox("sexual", "Contenido Sexual")}
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
            onChangeText={setTextComment}
            value={textComment}
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
          <Pressable  style={styles.button} onPress={handleSubmit}>
          <Text
              style={{ color: "#545351", fontWeight: "bold", fontSize: 12 }}
            >
              Denunciar
            </Text>
          </Pressable>
        </View>
        {message.length > 0 && <p style={{fontSize: "0.90rem", color: `${color}`}}>¡ {message} !</p>}
      </View>
    </View>
  );
}
