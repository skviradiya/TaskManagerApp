import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screens } from "@App/constants/screens";
import SignIn from "@App/screens/auth/SignIn";
import Register from "@App/screens/auth/Register";
import { AuthStackNavigationParams } from "@App/types/navigation";
import colors from "@App/constants/colors";

const Stack = createNativeStackNavigator<AuthStackNavigationParams>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={screens.SignInScreen} component={SignIn} />
      <Stack.Screen name={screens.RegisterScreen} component={Register} />
    </Stack.Navigator>
  );
}
