import CTButton from "@App/components/CTButton";
import CTInput from "@App/components/CTInput";
import asyncAccess from "@App/constants/asyncAccess";
import { screens } from "@App/constants/screens";
import { userActions } from "@App/redux/slices/userSlice";
import { useAppDispatch } from "@App/redux/store";
import { commonStyles } from "@App/styles/commonStyles";
import {
  AuthStackNavigationParams,
  RootStackParamList,
} from "@App/types/navigation";

import CTHeader from "@App/components/CTHeader";
import colors from "@App/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

export default function SignIn() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const userData = {
        email: formData.email,
      };

      await AsyncStorage.setItem(
        asyncAccess.userDetails,
        JSON.stringify(userData)
      );

      dispatch(userActions.setUserDetails(userData));
      navigation.replace(screens.UserStack);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container}>
      <CTHeader
        title="Sign In"
        showBack={false}
        subtitle="Welcome back to TaskManager"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={commonStyles.authContainer}>
            <Text style={commonStyles.title}>Welcome Back</Text>

            <View style={commonStyles.formContainer}>
              <CTInput
                label="Email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                error={errors.email}
                keyboardType="email-address"
              />

              <CTInput
                label="Password"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                error={errors.password}
                secureTextEntry
              />

              <CTButton
                onPress={handleSignIn}
                loading={loading}
                disabled={loading}
              >
                Sign In
              </CTButton>

              <View style={styles.linkTextContainer}>
                <Text style={styles.plainText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(screens.RegisterScreen)}
                >
                  <Text style={styles.linkText}>Register here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.errorMain,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  forgotPassword: {
    color: colors.primaryMain,
    textAlign: "right",
    marginVertical: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  linkContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
  },
  fullWidthLink: {
    width: "100%",
    textAlign: "center",
  },
  linkTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  plainText: {
    color: colors.darkText,
    fontSize: 16,
  },
  linkText: {
    color: colors.primaryMain,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
