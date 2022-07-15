import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { SwiperCard } from "./HomeScreen";
import useAuth from "../../hooks/useAuth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTailwind } from "tailwind-rn/dist";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

type RootStackParamList = {
  Message: {
    matchedDetails: { id: string; users: { [key: string]: SwiperCard } };
  };
};

interface Props extends NativeStackScreenProps<RootStackParamList, "Message"> {}

export type Message = {
  id: string;
  userId: string;
  message: string;
  photoURL: string;
};

const MessagesScreen: React.FC<Props> = ({ route }) => {
  const { user } = useAuth();
  const tailwind = useTailwind();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    addDoc(
      collection(db, "matches", route.params.matchedDetails.id, "messages"),
      {
        timestamp: serverTimestamp(),
        userId: user!.uid,
        displayName: user!.displayName,
        photoURL: route.params.matchedDetails.users[user!.uid].photoURL,
        message,
      }
    );
    setMessage("");
  };

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "matches", route.params.matchedDetails.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapShot) =>
        setMessages(
          snapShot.docs.map((dc) => ({ id: dc.id, ...(dc.data() as any) }))
        )
    );
  }, [route]);

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <Header
        title={
          getMatchedUserInfo(route.params.matchedDetails.users, user!.uid)
            .displayName
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tailwind("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <FlatList
            inverted
            data={messages}
            style={tailwind("pl-4")}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user!.uid ? (
                <SenderMessage key={message.userId} message={message} />
              ) : (
                <ReceiverMessage key={message.userId} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View
          style={tailwind(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <TextInput
            style={tailwind("h-10 text-lg")}
            placeholder="Send Message..."
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            value={message}
          />
          <Button onPress={sendMessage} title="Send" color="#ff5864" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;
