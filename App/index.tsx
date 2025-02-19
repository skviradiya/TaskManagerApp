import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { store } from "./redux/store";
import MainStack from "./navigation/MainStack";
import colors from "./constants/colors";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor={colors.darkBackground} />
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </View>
      </PaperProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
});
