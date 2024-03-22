import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/Auth";
import Home from "../screens/Home";
import ResetPassword from "../screens/ResetPassword";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { loggedInUser } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={loggedInUser ? "Home" : "SignIn"}
      screenOptions={{ headerShown: false }}
    >
      {loggedInUser ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}
