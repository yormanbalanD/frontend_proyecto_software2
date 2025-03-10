import React, { useEffect } from "react";
import {
  Text,
  Animated,
  StyleSheet,
  useAnimatedValue,
  Platform,
  View
} from "react-native";

function Web({ width, height, style }) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: size,
          opacity,
          backgroundColor: "#94a3b8",
        },
        style
      ]}
    />
  );
}

function Mobile({ width, height, style }) {
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
          width,
          height,
          borderRadius: 10,
          opacity,
          backgroundColor: "#94a3b8",
        },
        style
      ]}
    />
  );
}

export default function PlaceholderFoto({ width, height, style }) {
  if (Platform.OS == "android" || Platform.OS == "ios") {
    return <Mobile width={width} height={height} style={style} />;
  } else {
    return <Web width={width} height={height} style={style} />;
  }
}
