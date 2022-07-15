import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SwiperCard } from "../screens/HomeScreen";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { useTailwind } from "tailwind-rn/dist";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

const ChatRow: React.FC<{
  matchedDetails: { id: string; users: { [key: string]: SwiperCard } };
}> = ({ matchedDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const tailwind = useTailwind();

  const [matchedUserInfo, setMatchedUserInfo] = useState<SwiperCard>();
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users, user!.uid));
  }, [matchedDetails, user]);

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "matches", matchedDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setLastMessage(snapshot.docs[0]?.data().message)
    );
  }, [matchedDetails, user]);
  return (
    <TouchableOpacity
      style={[
        tailwind(
          "flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"
        ),
        styles.cardShadow,
      ]}
      onPress={() =>
        navigation.navigate("Message", {
          matchedDetails,
        })
      }
    >
      <Image
        source={{ uri: matchedUserInfo?.photoURL }}
        style={tailwind("rounded-full h-16 w-16 mr-4")}
      />
      <View>
        <Text style={tailwind("text-lg font-semibold")}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>{lastMessage || "Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
