import React, { useEffect } from "react";
import { Text, Animated, StyleSheet, useAnimatedValue } from "react-native";

export default function PlaceholderText({ width, fontSize }) {
  const opacity = useAnimatedValue(0.9);

  const animate = () => {
    Animated.timing(opacity, {
      toValue: 0.3,
      useNativeDriver: true,
      duration: 800,
    }).start(({ finished }) => {
      Animated.timing(opacity, {
        toValue: 0.9,
        useNativeDriver: true,
        duration: 800,
      }).start(animate);
    });
  };

  useEffect(() => {
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity,
          backgroundColor: "#94a3b8",
          width,
          borderRadius: 4,
        },
      ]}
    >
      <Text style={{ fontSize }}>{" "}</Text>
    </Animated.View>
  );
}
