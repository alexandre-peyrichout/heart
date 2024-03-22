import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";
import Animated, { FadeInDown } from "react-native-reanimated";

import { RootStackParamList } from "../navigation/Stack";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
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
            placeholder="Email"
            placeholderTextColor={"gray"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            inputMode="email"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          className="bg-black/5 p-5 rounded-2xl w-full mb-3"
        >
          <TextInput
            placeholder="Password"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          className="w-full"
        >
          <TouchableOpacity
            className="bg-sky-400 w-full p-3 mb-3 rounded-2xl"
            onPress={handleSignIn}
          >
            <Text className="text-white font-bold text-xl text-center">
              Sign In
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(800).duration(1000).springify()}
          className="flex-row justify-center"
        >
          <Text>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            disabled={isLoading}
          >
            <Text className="text-sky-600">Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(1000).duration(1000).springify()}
          className="flex-row justify-center"
        >
          <Text>Forgot your password? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPassword")}
          >
            <Text className="text-sky-600">Reset</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
