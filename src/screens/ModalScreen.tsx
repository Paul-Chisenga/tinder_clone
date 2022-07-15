import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import { db } from "../../firebase";

const ModalScreen = () => {
  const tailwind = useTailwind();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState<string>(
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
  );
  const [job, setJob] = useState<string>();
  const [age, setAge] = useState<string>();

  const invalid = !image || !job || !age;

  const updateUserProfile = async () => {
    try {
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          displayName: user.displayName,
          photoURL: image,
          job,
          age,
          timestamp: serverTimestamp(),
        });
        navigation.navigate("Home");
      } else {
        alert("error");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={tailwind("flex-1 items-center pt-1 px-8")}>
      <Image
        style={tailwind("h-20 w-full")}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tailwind("text-xl text-gray-500 font-bold p-2")}>
        Welcome {user?.displayName}
      </Text>

      <View>
        <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
          Step 1: The Profile Pic
        </Text>
        <TextInput
          placeholder="Enter a profile pic URL"
          value={image}
          onChangeText={setImage}
          style={tailwind("text-center text-xl pb-2")}
        />
      </View>
      <View>
        <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
          Step 2: The Job
        </Text>
        <TextInput
          placeholder="Enter a occupation"
          value={job}
          onChangeText={setJob}
          style={tailwind("text-center text-xl pb-2")}
        />
      </View>
      <View>
        <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
          Step 3: The Age
        </Text>
        <TextInput
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          maxLength={2}
          keyboardType="numeric"
          style={tailwind("text-center text-xl pb-2")}
        />
      </View>
      <TouchableOpacity
        disabled={invalid}
        style={[
          tailwind("w-64 p-3 absolute bottom-10 rounded-xl "),
          invalid ? tailwind("bg-gray-400") : tailwind("bg-red-400"),
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tailwind("text-center text-white text-xl")}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
