import React, { useEffect } from "react";
import {
  Text,
  Animated,
  StyleSheet,
  useAnimatedValue,
  Platform,
  View
} from "react-native";

function Web({ width, fontSize, style }) {
  return (
    <View
      style={[
        {
          opacity: 0.9,
          backgroundColor: "#94a3b8",
          width,
          borderRadius: 4,
          style,
        },
      ]}
    >
      <Text style={{ fontSize }}> </Text>
    </View>
  );
}

function Mobile({ width, fontSize, style }) {
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
        style,
      ]}
    >
      <Text style={{ fontSize }}> </Text>
    </Animated.View>
  );
}

export default function PlaceholderText({ width, fontSize, style }) {
  if (Platform.OS == "android" || Platform.OS == "ios") {
    return <Mobile style={style} width={width} fontSize={fontSize} />;
  } else {
    return <Web style={style} width={width} fontSize={fontSize} />;
  }
}
