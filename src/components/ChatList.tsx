import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import { db } from "../../firebase";
import { SwiperCard } from "../screens/HomeScreen";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const tailwind = useTailwind();
  const [matches, setMatches] = useState<
    { id: string; users: { [key: string]: SwiperCard } }[]
  >([]);
  const { user } = useAuth();

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "matches"),
        where("usersMatched", "array-contains", user!.uid)
      ),
      (snapshot) =>
        setMatches(
          snapshot.docs.map((dc) => ({
            ...dc.data(),
            id: dc.id,
          })) as any
        )
    );
  }, [user]);
  return (
    <FlatList
      style={tailwind("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchedDetails={item} />}
    />
  );
};

export default ChatList;
