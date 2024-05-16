import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

import { collection, getDocs, limit, query } from "firebase/firestore";

import { db } from "../services/firebase";

export default function Sentence() {
  const [sentence, setSentence] = useState<string>("");

  useEffect(() => {
    const fetchSentence = async () => {
      try {
        const q = query(collection(db, "sentences"), limit(1));
        const sentences = await getDocs(q);
        setSentence(sentences.docs[0].data()["content_m_m"]);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    fetchSentence();
  }, []);

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <View className="flex justify-center mx-4">
        <Text className="text-black text-lg mt-2 text-center">{sentence}</Text>
      </View>
    </View>
  );
}
