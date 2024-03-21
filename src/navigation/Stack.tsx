import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/Auth";
import Login from "../screens/Login";
import ResetPassword from "../screens/ResetPassword";
import Signup from "../screens/Signup";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { loggedInUser } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={loggedInUser ? "Login" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {/* {loggedInUser ? (
        <Stack.Screen name="Home" component={Home} />
      ) : ( */}
      <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </>
      {/* )} */}
    </Stack.Navigator>
  );
}
