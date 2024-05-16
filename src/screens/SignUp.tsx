import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import Animated, { FadeInDown } from "react-native-reanimated";

import { RootStackParamList } from "../navigation/Stack";
import { auth, db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUp({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [firstname, setFirstname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match");
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // Add entry in "users" collection
      await addDoc(collection(db, "users"), {
        account_id: auth.currentUser.uid,
        gender: gender,
        firstname: firstname,
      });
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
        >
          <Text className="text-gray-500 font-bold ml-2 mb-2">Je suis:</Text>
          <View className="flex-row bg-black/5 p-5 rounded-2xl w-full">
            <TouchableOpacity
              className="flex-row items-center mr-4"
              onPress={() => setGender("male")}
            >
              <View
                className={`w-4 h-4 rounded-full border-2 ${
                  gender === "male"
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400"
                }`}
              />
              <Text className="text-gray-500 ml-2">Un papa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setGender("female")}
            >
              <View
                className={`w-4 h-4 rounded-full border-2 ${
                  gender === "female"
                    ? "bg-pink-500 border-pink-500"
                    : "border-gray-400"
                }`}
              />
              <Text className="text-gray-500 ml-2">Une maman</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className="bg-black/5 p-5 rounded-2xl w-full"
        >
          <TextInput
            placeholder="Prénom"
            placeholderTextColor={"gray"}
            value={firstname}
            onChangeText={setFirstname}
          />
        </Animated.View>
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
          className="bg-black/5 p-5 rounded-2xl w-full"
        >
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          className="bg-black/5 p-5 rounded-2xl w-full mb-3"
        >
          <TextInput
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          className="w-full"
        >
          <TouchableOpacity
            className="bg-black w-full p-3 mb-3 rounded-2xl"
            onPress={handleSignUp}
            disabled={isLoading || !email || !password || !confirmPassword}
          >
            <Text className="text-white font-bold text-xl text-center">
              M'inscrire
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(800).duration(1000).springify()}
          className="flex-row justify-center"
        >
          <Text>Vous avez déjà un compte? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text className="text-sky-600">Se connecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
