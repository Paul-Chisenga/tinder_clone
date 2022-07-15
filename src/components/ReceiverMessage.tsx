import { View, Text, Image } from "react-native";
import React from "react";
import { Message } from "../screens/MessagesScreen";
import { useTailwind } from "tailwind-rn/dist";

const ReceiverMessage: React.FC<{ message: Message }> = ({ message }) => {
  const tailwind = useTailwind();
  return (
    <View
      style={[
        tailwind(
          "bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14"
        ),
        { alignSelf: "flex-start" },
      ]}
    >
      <Image
        source={{ uri: message.photoURL }}
        style={tailwind("h-12 w-12 rounded-full absolute top-0 -left-14")}
      />
      <Text style={tailwind("text-white")}>{message.message}</Text>
    </View>
  );
};

export default ReceiverMessage;
