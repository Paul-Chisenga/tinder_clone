import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Message } from "../screens/MessagesScreen";

const SenderMessage: React.FC<{ message: Message }> = ({ message }) => {
  const tailwind = useTailwind();
  return (
    <View
      style={[
        tailwind(
          "bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2"
        ),
        { alignSelf: "flex-start", marginLeft: "auto" },
      ]}
    >
      <Text style={tailwind("text-white")}>{message.message}</Text>
    </View>
  );
};

export default SenderMessage;
