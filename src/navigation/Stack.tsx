import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

export type RootStackParamList = {
  Login: undefined;
  SignUp: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
}
