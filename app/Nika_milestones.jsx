import { useState, useEffect } from "react";
import { Text, View, TextInput, ImageBackground, TouchableOpacity} from "react-native";
import '../app/_layout'; // Importing the CSS file

const backgrounds = {
  short: "https://i.pinimg.com/736x/5e/46/ab/5e46ab7c6402b6b57231e6914e2fc246.jpg",
  medium: "https://i.pinimg.com/474x/81/08/91/810891a59443aea2a73d4594455ff1da.jpg",
  long: "https://i.pinimg.com/736x/20/49/4e/20494e65b8fcdce9348dddd11a9f29c0.jpg",
};

export default function Index() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [bgImage, setBgImage] = useState(backgrounds.short);

  const handleSubmit = () => setSubmitted(message);

  useEffect(() => {
    if (message.length < 6) {
      setBgImage(backgrounds.short);
    } else if (message.length < 11) {
      setBgImage(backgrounds.medium);
    } else {
      setBgImage(backgrounds.long);
    }
  }, [message]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: bgImage }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
         <View
          style={{
            backgroundColor: "white",
            opacity: 0.8,
            padding: 20,
            borderRadius: 10,
            // iOS shadow properties
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            // Android shadow property
            elevation: 8,
          }}
        >
          <Text className="text-lg text-center">
            Welcome to my app! Please tell me your name
          </Text>

          <TextInput
            className="h-10 border border-gray-300 mb-3 px-3"
            placeholder="Type here :>"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TheButton label="Submit" onPress={handleSubmit} />

          <Text className="text-lg text-center">
            {submitted ? `Nice to meet you ${submitted}!` : "No name submitted yet."}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function TheButton({ label, onPress }) {
  return (
    <TouchableOpacity className="bg-pink-400 border-2 border-gray-300 p-3 rounded-lg" onPress={onPress}>
      <Text className="text-white text-lg text-center">{label}</Text>
    </TouchableOpacity>
  );
}