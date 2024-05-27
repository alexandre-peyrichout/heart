import React, { useState } from "react";
import { Alert, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button, Text, TextInput } from "react-native-paper";

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
        <TextInput
          mode="outlined"
          label="Émail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          inputMode="email"
        />

        <View className="w-full">
          <Button
            mode="contained"
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            Réinitialiser mon mot de passe
          </Button>
        </View>
        <View className="flex-row justify-center items-center">
          <Text>Finalement, je m'en souviens! </Text>
          <Button mode="text" onPress={() => navigation.navigate("SignIn")}>
            Se connecter
          </Button>
        </View>
      </View>
    </View>
  );
}
