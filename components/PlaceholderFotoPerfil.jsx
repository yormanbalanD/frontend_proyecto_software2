import React, { useEffect } from "react";
import {
  Text,
  Animated,
  StyleSheet,
  useAnimatedValue,
  Platform,
  View
} from "react-native";

function Web({ size, style }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size,
          opacity,
          backgroundColor: "#94a3b8",
        },
        style,
      ]}
    />
  );
}

function Mobile({ size, style }) {
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
          width: size,
          height: size,
          borderRadius: size,
          opacity,
          backgroundColor: "#94a3b8",
        },
        style,
      ]}
    >
      <Text> </Text>
    </Animated.View>
  );
}

export default function PlaceholderFotoPerfil({ size, fontSize, style }) {
  if (Platform.OS == "android" || Platform.OS == "ios") {
    return <Mobile style={style} size={size} />;
  } else {
    return <Web style={style} size={size} />;
  }
}
