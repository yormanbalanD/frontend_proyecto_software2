import React, { useEffect } from "react";
import {
  Text,
  Animated,
  StyleSheet,
  useAnimatedValue,
  Platform,
} from "react-native";

function Web({ size, fontSize }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size,
          opacity: 0.9,
          backgroundColor: "#94a3b8",
          borderRadius: 4,
        },
      ]}
    >
      <Text style={{ fontSize }}> </Text>
    </View>
  );
}

function Mobile({ size, fontSize }) {
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
      ]}
    >
      <Text style={{ fontSize }}> </Text>
    </Animated.View>
  );
}

export default function PlaceholderText({ size, fontSize }) {
  if (Platform.OS == "android" || Platform.OS == "ios") {
    return <Mobile size={size} fontSize={fontSize} />;
  } else {
    return <Web size={size} fontSize={fontSize} />;
  }
}
