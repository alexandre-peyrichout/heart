import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import { collection, getDocs, limit, query } from "firebase/firestore";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
        Alert.alert("Erreur", error.message);
      }
    };
    fetchSentence();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{ justifyContent: "space-around", flexGrow: 1 }}
      >
        <View className="flex justify-center mx-4">
          <Text variant="displayMedium" className="italic text-center">
            "{sentence}"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
