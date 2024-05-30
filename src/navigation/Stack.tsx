import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

import { useAuth } from "../context/Auth";
import AddChild from "../screens/AddChild";
import EditChild from "../screens/EditChild";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import ResetPassword from "../screens/ResetPassword";
import Sentence from "../screens/Sentence";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  HomeTabs: { screen?: string };
  Sentence: undefined;
  AddChild: undefined;
  EditChild: { childId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Mes enfants", tabBarIcon: "home", tabBarBadge: 2 }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Mon profil", tabBarIcon: "account" }}
      />
    </Tab.Navigator>
  );
};

export default function StackNavigator() {
  const { loggedInUser } = useAuth();

  return (
    <Stack.Navigator initialRouteName={loggedInUser ? "HomeTabs" : "SignIn"}>
      {loggedInUser ? (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ title: "", headerShown: false }}
          />
          <Stack.Screen
            name="Sentence"
            component={Sentence}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="AddChild"
            component={AddChild}
            options={{ title: "Ajouter mon enfant" }}
          />
          <Stack.Screen
            name="EditChild"
            component={EditChild}
            options={{ title: "Éditer mon enfant" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
