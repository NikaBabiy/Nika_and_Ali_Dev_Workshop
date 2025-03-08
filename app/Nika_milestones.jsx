import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Animated
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

// Background images
const backgrounds = {
  short: "https://i.pinimg.com/736x/5e/46/ab/5e46ab7c6402b6b57231e6914e2fc246.jpg",
  medium: "https://i.pinimg.com/474x/81/08/91/810891a59443aea2a73d4594455ff1da.jpg",
  long: "https://i.pinimg.com/736x/20/49/4e/20494e65b8fcdce9348dddd11a9f29c0.jpg",
};

export default function Index() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [bgImage, setBgImage] = useState(backgrounds.short);

  // Animated values for bounce & background color transitions
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;

  // Ref for the confetti cannon
  const confettiRef = useRef(null);

  // Bounces + color transitions on user input
  useEffect(() => {
    // 1) BOUNCE animation when typing
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    // 2) Background color transitions
    let colorIndex = 0; // Default short
    if (message.length >= 6 && message.length < 11) {
      colorIndex = 1; // Medium
    } else if (message.length >= 11) {
      colorIndex = 2; // Long
    }

    Animated.timing(bgColorAnim, {
      toValue: colorIndex,
      duration: 500,
      useNativeDriver: false
    }).start();

    // 3) Change background image
    if (message.length < 6) {
      setBgImage(backgrounds.short);
    } else if (message.length < 11) {
      setBgImage(backgrounds.medium);
    } else {
      setBgImage(backgrounds.long);
    }
  }, [message]);

  // Interpolate bgColorAnim from [0..2] → RGB values
  const cardBackgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      "rgba(255,255,255,0.7)",
      "rgba(255,200,200,0.6)",
      "rgba(255,150,150,0.7)"
    ]
  });

  // Handle submission
  const handleSubmit = () => {
    setSubmitted(message);
    if (confettiRef.current) {
      confettiRef.current.start(); // Fire confetti
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: bgImage }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {/* Animated translucent card */}
        <Animated.View
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: cardBackgroundColor,
            transform: [{ scale: scaleAnim }],
            // Shadows
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 10 }}>
            Welcome to my app! Please tell me your name
          </Text>

          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              paddingHorizontal: 8,
              width: 200,
            }}
            placeholder="Type here :>"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />

          <TheButton label="Submit" onPress={handleSubmit} />

          <Text style={{ fontSize: 18, textAlign: "center", marginTop: 10 }}>
            {submitted ? `Nice to meet you ${submitted}!` : "No name submitted yet."}
          </Text>
        </Animated.View>

        {/* Confetti Cannon */}
        <ConfettiCannon
          count={50}
          origin={{ x: 200, y: 0 }}
          autoStart={false}
          ref={confettiRef}
          fadeOut={true}
          explosionSpeed={250}
          fallSpeed={3000}
        />
      </ImageBackground>
    </View>
  );
}

// Simple reusable button
function TheButton({ label, onPress }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "pink",
        borderWidth: 2,
        borderColor: "gray",
        padding: 10,
        borderRadius: 8,
      }}
      onPress={onPress}
    >
      <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
