// In App.js in a new project

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./src/context/Auth";
import StackNavigator from "./src/navigation/Stack";

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
