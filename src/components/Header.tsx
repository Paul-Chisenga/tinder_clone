import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header: React.FC<{ title: string }> = ({ title }) => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  return (
    <View style={tailwind("p-2 flex-row items-center justify-between")}>
      <View style={tailwind("flex flex-row items-center")}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tailwind("p-2")}
        >
          <Ionicons name="chevron-back-outline" size={34} color="#ff5864" />
        </TouchableOpacity>
        <Text style={tailwind("text-2xl font-bold ")}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;
