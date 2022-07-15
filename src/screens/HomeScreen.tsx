import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn/dist";
import useAuth from "../../hooks/useAuth";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import generateId from "../lib/generateId";

export type SwiperCard = {
  id: string;
  displayName: string;
  job: string;
  photoURL: string;
  age: number;
};

// const cards: SwiperCard[] = [
//   {
//     id: "1",
//     firstname: "Sonny",
//     lastname: "Sangya",
//     job: "Software Developer",
//     photoURL: "https://avatars.githubusercontent.com/u/24712956?v=4",
//     age: 27,
//   },
//   {
//     id: "2",
//     firstname: "Elon",
//     lastname: "Musk",
//     job: "Software Developer",
//     photoURL: "https://avatars.githubusercontent.com/u/24712956?v=4",
//     age: 40,
//   },
// ];

const HomeScreen = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef<Swiper<SwiperCard>>(null);
  const [profiles, setProfiles] = useState<SwiperCard[]>([]);

  useLayoutEffect(() => {
    if (user) {
      return onSnapshot(doc(db, "users", user?.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        } else {
        }
      });
    }
  }, [user]);

  useEffect(() => {
    let unsub: Unsubscribe;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user!.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((dc) => dc.id));

      const passedIds = passes.length > 0 ? passes : ["test"];

      const swipes = await getDocs(
        collection(db, "users", user!.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((dc) => dc.id));

      const swipedIds = swipes.length > 0 ? swipes : ["test"];

      return onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedIds, ...swipedIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((dc) => dc.id !== user?.uid)
              .map((dc) => ({
                ...(dc.data() as SwiperCard),
                id: dc.id,
              }))
          );
        }
      );
    };
    fetchCards().then((unsubscribe) => {
      unsub = unsubscribe;
    });
    return unsub;
  }, []);

  const swiptLeft = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "users", user!.uid, "passes", userSwiped.id), userSwiped);
  };
  const swiptRight = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    const loggedInProfile = await getDoc(doc(db, "users", user!.uid)).then(
      (dc) => dc.data()
    );
    await getDoc(doc(db, "users", userSwiped.id, "swipes", user!.uid)).then(
      async (docSnapshop) => {
        if (docSnapshop.exists()) {
          // create a match
          console.log("HOORAY You matched with ", userSwiped.displayName);

          await setDoc(
            doc(db, "users", user!.uid, "swipes", userSwiped.id),
            userSwiped
          );

          // CREATE A MATCH
          await setDoc(
            doc(db, "matches", generateId(user!.uid, userSwiped.id)),
            {
              users: {
                [user!.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              usersMatched: [user!.uid, userSwiped.id],
              timestamp: serverTimestamp(),
            }
          );

          navigation.navigate("Match", { loggedInProfile, userSwiped });
        } else {
          await setDoc(
            doc(db, "users", user!.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      {/* Header */}
      <View style={tailwind("flex-row justify-between items-center p-2")}>
        <TouchableOpacity style={tailwind("")} onPress={logout}>
          <Image
            source={{ uri: user!.photoURL as string }}
            style={tailwind("h-10 w-10 rounded-full")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            source={require("../../assets/logo.png")}
            style={tailwind("h-14 w-14")}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={tailwind("")}
          onPress={() => navigation.navigate("Chat")}
        >
          <Ionicons name="chatbubbles-sharp" size={30} color="#ff5864" />
        </TouchableOpacity>
      </View>
      {/* End header */}

      {/* Content */}
      <View style={tailwind("flex-1 -mt-6 ")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          backgroundColor="#ffffff"
          verticalSwipe={false}
          onSwipedLeft={swiptLeft}
          onSwipedRight={swiptRight}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tailwind("relative bg-white h-3/4 rounded-xl")}
              >
                <Image
                  source={{ uri: card.photoURL }}
                  style={tailwind("absolute h-full w-full rounded-xl ")}
                />
                <View
                  style={[
                    tailwind(
                      "bg-white w-full h-20 absolute bottom-0 flex-row justify-between items-center px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tailwind("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tailwind("font-bold text-2xl")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View style={tailwind("flex-1 bg-slate-100  rounded")}>
                <Text>No profiles found</Text>
              </View>
            )
          }
        />
      </View>
      <View style={tailwind("flex-row bg justify-evenly py-2 bg-slate-100")}>
        <TouchableOpacity
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
          onPress={() => swipeRef.current?.swipeLeft()}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
          onPress={() => swipeRef.current?.swipeRight()}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 1,
  },
});
