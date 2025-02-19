import { screens } from "@App/constants/screens";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Task } from "./task";

export type RootStackParamList = {
  [screens.HomeScreen]: { newTask?: Task; deletedTaskId?: number };
  [screens.TaskDetails]: { task: Task };
  [screens.TaskForm]: { mode: "add" | "edit"; task?: Task };
  [screens.AuthStack]: undefined;
  [screens.UserStack]: undefined;
  [screens.SignInScreen]: undefined;
  [screens.RegisterScreen]: undefined;
  [screens.SplashScreen]: undefined;
};

export type UserStackNavigationParams = {
  [screens.HomeScreen]: { newTask?: Task; deletedTaskId?: number };
  [screens.TaskDetails]: { task: Task };
  [screens.TaskForm]: { mode: "add" | "edit"; task?: Task };
  
};

export type AuthStackNavigationParams = {
  [screens.SignInScreen]: undefined;
  [screens.RegisterScreen]: undefined;
  [screens.RegisterScreen]: undefined;
};

export type MainStackNavigationParams = {
  [screens.SplashScreen]: undefined;
  [screens.AuthStack]: undefined;
  [screens.UserStack]: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type UserStackNavigationProp = NativeStackNavigationProp<UserStackNavigationParams>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackNavigationParams>;
