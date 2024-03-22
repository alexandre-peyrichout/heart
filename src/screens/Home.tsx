import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { auth } from "../services/firebase";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <View className="mx-4">
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
