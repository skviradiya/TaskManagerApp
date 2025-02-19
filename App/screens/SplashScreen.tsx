import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Platform } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { screens } from "@App/constants/screens";
import asyncAccess from "@App/constants/asyncAccess";
import { useAppDispatch } from "@App/redux/store";
import { userActions } from "@App/redux/slices/userSlice";
import { MainNavigationProps } from "@App/types/navigation";
import colors from "@App/constants/colors";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<MainNavigationProps>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Progress bar animation
      Animated.timing(progressWidth, {
        toValue: width - 80, // Full width minus padding
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();

    // Check auth status after animations
    const timer = setTimeout(checkAuthStatus, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userDetails = await AsyncStorage.getItem(asyncAccess.userDetails);
      if (userDetails) {
        dispatch(userActions.setUserDetails(JSON.parse(userDetails)));
        navigation.replace(screens.UserStack);
      } else {
        navigation.replace(screens.AuthStack);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      navigation.replace(screens.AuthStack);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>✓</Text>
        <Text style={styles.appName}>TaskManager</Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkBackground,
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    color: colors.primaryMain,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.darkText,
    letterSpacing: 1,
  },
  progressContainer: {
    width: "100%",
    height: 4,
    backgroundColor: colors.darkBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primaryMain,
    borderRadius: 2,
  },
});
