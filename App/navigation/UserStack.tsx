import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screens } from "@App/constants/screens";
import Home from "@App/screens/user/Home";
import TaskDetails from "@App/screens/user/TaskDetails";
import TaskForm from "@App/screens/user/TaskForm";
import { UserStackNavigationParams } from "@App/types/navigation";
import colors from "@App/constants/colors";

const Stack = createNativeStackNavigator<UserStackNavigationParams>();

export default function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={screens.HomeScreen} component={Home} />
      <Stack.Screen name={screens.TaskDetails} component={TaskDetails} />
      <Stack.Screen name={screens.TaskForm} component={TaskForm} />
    </Stack.Navigator>
  );
}
