import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import useAuth from "../../hooks/useAuth";

const LoginScreen = () => {
  const { singInWithGoogle } = useAuth();
  const navigation = useNavigation();
  const tailwind = useTailwind();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <View style={tailwind("flex-1")}>
      <StatusBar translucent={true} />
      <ImageBackground
        resizeMode="cover"
        style={tailwind("flex-1")}
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          style={[
            tailwind("absolute bottom-24 w-52 bg-white rounded-2xl p-4"),
            { marginHorizontal: "25%" },
          ]}
          onPress={singInWithGoogle}
        >
          <Text style={tailwind("text-center font-semibold")}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
