// In App.js in a new project

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "./src/navigation/Stack";

function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default App;
