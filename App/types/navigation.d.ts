import { screens } from "@App/constants/screens";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type MainStackNavigationParams = {
    [screens.SplashScreen]:undefined,
    [screens.AuthStack]:undefined,
    [screens.UserStack]:undefined,
}

export type MainNavigationProps=NativeStackNavigationProp<MainStackNavigationParams>
