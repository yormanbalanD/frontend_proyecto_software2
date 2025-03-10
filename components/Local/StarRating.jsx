import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";

export default function StarRating({ rating, maxStars = 5 }) {
    return (
      <View style={{ flexDirection: "row" }}>
        {[...Array(rating)].map((_, i) => (
          <Icon
            key={i}
            name={i < rating ? "star" : "star"}
            color={i < rating ? "#FFD700" : "#fff"}
            size={20}
          />
        ))}
      </View>
    );
  };