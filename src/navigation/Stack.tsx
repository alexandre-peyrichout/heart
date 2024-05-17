import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/Auth";
import AddChild from "../screens/AddChild";
import EditChild from "../screens/EditChild";
import Home from "../screens/Home";
import ResetPassword from "../screens/ResetPassword";
import Sentence from "../screens/Sentence";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  Home: undefined;
  Sentence: undefined;
  AddChild: undefined;
  EditChild: { childId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { loggedInUser } = useAuth();

  return (
    <Stack.Navigator initialRouteName={loggedInUser ? "Home" : "SignIn"}>
      {loggedInUser ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Mes enfants" }}
          />
          <Stack.Screen
            name="Sentence"
            component={Sentence}
            options={{ title: "Ma phrase" }}
          />
          <Stack.Screen
            name="AddChild"
            component={AddChild}
            options={{ title: "Ajouter mon enfant" }}
          />
          <Stack.Screen
            name="EditChild"
            component={EditChild}
            options={{ title: "Modifier mon enfant" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: "Se connecter" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: "Créer un compte" }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ title: "Récupération" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
