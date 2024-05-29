import React, { useState } from "react";
import { Alert, View } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

import { RootStackParamList } from "../navigation/Stack";
import { auth, db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUp({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

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
        email: email,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full h-full ">
      <View className="m-4 space-y-4">
        <SegmentedButtons
          value={gender}
          onValueChange={setGender}
          buttons={[
            {
              icon: "human-male",
              value: "male",
              label: "Homme",
            },
            {
              icon: "human-female",
              value: "female",
              label: "Femme",
            },
          ]}
        />
        <TextInput
          mode="outlined"
          label="Prénom"
          value={firstname}
          onChangeText={setFirstname}
        />
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
          secureTextEntry
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

        <TextInput
          mode="outlined"
          label="Confirmer le mot de passe"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
        <Button
          mode="contained"
          onPress={handleSignUp}
          disabled={
            isLoading ||
            !email ||
            !password ||
            !confirmPassword ||
            !gender ||
            !firstname
          }
        >
          M'inscrire
        </Button>
        <View className="flex-row justify-center items-center">
          <Text>Vous avez déjà un compte? </Text>
          <Button mode="text" onPress={() => navigation.navigate("SignIn")}>
            Se connecter
          </Button>
        </View>
      </View>
    </View>
  );
}
