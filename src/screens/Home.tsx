import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../services/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [article, setArticle] = useState<string>("");

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
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", "c2m3HjXLd6YpXgoymj2d");
        const article = await getDoc(docRef);
        setArticle(article.data().content[0].value);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchArticle();
  }, []);

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <View className="flex flex-col items-center justify-center">
        <Text className="text-black text-lg mt-4">{article}</Text>
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
