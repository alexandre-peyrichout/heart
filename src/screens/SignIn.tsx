import React, { useState } from "react";
import { Alert, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Text, TextInput } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../navigation/Stack";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={{ justifyContent: "space-around", flexGrow: 1 }}
        className="w-full h-full"
      >
        <View className="mx-4 space-y-4">
          <Text variant="titleLarge">Bienvenue!</Text>
          <TextInput
            mode="outlined"
            label="Émail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            inputMode="email"
          />

          <TextInput
            mode="outlined"
            label="Mot de passe"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            right={
              secureTextEntry ? (
                <TextInput.Icon
                  icon="eye"
                  onPress={() => setSecureTextEntry(false)}
                />
              ) : (
                <TextInput.Icon
                  icon="eye-off"
                  onPress={() => setSecureTextEntry(true)}
                />
              )
            }
          />
          <Button mode="contained" onPress={handleSignIn}>
            Se connecter
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("ResetPassword")}
          >
            Vous avez oublié votre mot de passe?
          </Button>

          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            className="flex-row justify-center items-center"
          >
            <Text>Vous n'avez pas de compte?</Text>
            <Button
              compact
              disabled={isLoading}
              mode="text"
              onPress={() => navigation.navigate("SignUp")}
            >
              Créer un compte
            </Button>
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
