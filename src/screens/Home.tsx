import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, getDocs } from "firebase/firestore";

import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [children, setChildren] = useState([]);
  const { loggedInUser } = useAuth();

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const children = await getDocs(
          collection(loggedInUser.doc, `/children`)
        );
        setChildren(children.docs.map((doc) => doc.data()));
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    fetchChildren();
  }, [auth.currentUser.uid]);

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <View className="flex justify-center mx-4">
        {children.map((child, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Sentence")}
            className="bg-gray-200 p-4 rounded-2xl my-2"
          >
            <Image
              source={{ uri: child.picture }}
              className="w-32 h-32 mx-auto"
            />
            <Text className="text-black text-lg mt-2 text-center">
              {child.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key="add"
          onPress={() => null}
          className="bg-sky-400 w-full p-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-xl text-center">Add</Text>
        </TouchableOpacity>
      </View>
      <View className="mx-4">
        <Text className="text-black text-lg mt-4 text-center">
          Logged in as: {auth.currentUser.email}
        </Text>
        <TouchableOpacity
          className="bg-sky-400 w-full p-3 rounded-2xl"
          onPress={handleLogOut}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-xl text-center">
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
