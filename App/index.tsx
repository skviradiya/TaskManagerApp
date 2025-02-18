import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainStack from "./navigation/MainStack";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
}
