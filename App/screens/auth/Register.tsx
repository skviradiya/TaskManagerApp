import CTButton from "@App/components/CTButton";
import CTHeader from "@App/components/CTHeader";
import CTInput from "@App/components/CTInput";
import asyncAccess from "@App/constants/asyncAccess";
import colors from "@App/constants/colors";
import { screens } from "@App/constants/screens";
import { userActions } from "@App/redux/slices/userSlice";
import { useAppDispatch } from "@App/redux/store";
import { commonStyles } from "@App/styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
  AuthStackNavigationParams,
  RootStackParamList,
} from "@App/types/navigation";

export default function Register() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulated API call - replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock user data - replace with actual API response
      const userData = {
        email: formData.email,
        name: formData.name,
        // Add other user details as needed
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        asyncAccess.userDetails,
        JSON.stringify(userData)
      );

      // Update Redux store
      dispatch(userActions.setUserDetails(userData));

      // Navigate to UserStack
      navigation.replace(screens.UserStack);
    } catch (error) {
      console.error(error);
      // Handle error (show error message to user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container}>
      <CTHeader
        title="Create Account"
        onBack={() => navigation.navigate(screens.SignInScreen)}
        subtitle="Join TaskManager today"
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
            <View style={commonStyles.formContainer}>
              <CTInput
                label="Name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                error={errors.name}
                autoCapitalize="words"
              />

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

              <CTInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                error={errors.confirmPassword}
                secureTextEntry
              />

              <CTButton
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
              >
                Register
              </CTButton>

              <View style={styles.linkTextContainer}>
                <Text style={styles.plainText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(screens.SignInScreen)}
                >
                  <Text style={styles.linkText}>Sign in here</Text>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
