import { screens } from "@App/constants/screens";

import SplashScreen from "@App/screens/SplashScreen";
import { MainStackNavigationParams } from "@App/types/navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";

const Stack = createNativeStackNavigator<MainStackNavigationParams>();
export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={SplashScreen} name={screens.SplashScreen} />
      <Stack.Screen component={AuthStack} name={screens.AuthStack} />
      <Stack.Screen component={UserStack} name={screens.UserStack} />
    </Stack.Navigator>
  );
}
