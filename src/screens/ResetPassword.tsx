import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { RootStackParamList } from "../navigation/Stack";

type Props = NativeStackScreenProps<RootStackParamList, "ResetPassword">;

export default function ResetPassword({ navigation }: Props) {
  return (
    <View className="bg-white w-full h-full">
      <StatusBar style="light" />
      <Image
        className="w-full h-full absolute"
        source={require("../assets/images/background.png")}
      />
      {/* Lights */}
      <View className="w-full flex-row justify-around absolute">
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          className="h-[225] w-[90]"
          source={require("../assets/images/light.png")}
        />
        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify()}
          className="h-[160] w-[65]"
          source={require("../assets/images/light.png")}
        />
      </View>
      {/* Title and form */}
      <View className="w-full h-full flex justify-around pt-40 pb-10">
        {/* Title */}
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            className="text-5xl font-bold text-white tracking-wider"
          >
            Login
          </Animated.Text>
        </View>
        {/* Form */}
        <View className="flex items-center mx-4 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput placeholder="Email" placeholderTextColor={"gray"} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="w-full"
          >
            <TouchableOpacity className="bg-sky-400 w-full p-3 mb-3 rounded-2xl">
              <Text className="text-white font-bold text-xl text-center">
                Send recovery email
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            className="flex-row justify-center"
          >
            <Text>Forget about it, I remember now! </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-sky-600">Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
