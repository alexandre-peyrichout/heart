import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { sendPasswordResetEmail } from "firebase/auth";
import Animated, { FadeInDown } from "react-native-reanimated";

import { RootStackParamList } from "../navigation/Stack";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "ResetPassword">;

export default function ResetPassword({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Mail envoyé",
        "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("SignIn"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <View className="mx-4 space-y-4">
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className="bg-black/5 p-5 rounded-2xl w-full"
        >
          <TextInput
            placeholder="Émail"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            inputMode="email"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          className="w-full"
        >
          <TouchableOpacity
            className="bg-black w-full p-3 mb-3 rounded-2xl"
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-xl text-center">
              Réinitialiser mon mot de passe
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          className="flex-row justify-center"
        >
          <Text>Finalement, je m'en souviens! </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text className="text-sky-600">Se connecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
