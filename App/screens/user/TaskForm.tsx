import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import colors from "@App/constants/colors";
import CTButton from "@App/components/CTButton";
import { screens } from "@App/constants/screens";
import CTHeader from "@App/components/CTHeader";
import { Task } from "@App/types/task";
import { UserStackNavigationParams } from "@App/types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function TaskForm() {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackNavigationParams>>();
  const route =
    useRoute<RouteProp<UserStackNavigationParams, screens.TaskForm>>();

  const { task, mode } = route.params;
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditMode && task) {
        const updatedTask = {
          ...task,
          ...formData,
        };
        // Navigate back to details with updated task
        navigation.navigate(screens.TaskDetails, { task: updatedTask });
      } else {
        const newTask = {
          id: Date.now(),
          ...formData,
        };
        navigation.navigate(screens.HomeScreen, { newTask });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CTHeader
        title={isEditMode ? "Edit Task" : "Add Task"}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.formContainer}>
          <TextInput
            label="Task Title"
            value={formData.title}
            onChangeText={(text) => {
              setFormData({ ...formData, title: text });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            mode="outlined"
            style={styles.input}
            error={!!errors.title}
            outlineColor={colors.gray}
            activeOutlineColor={colors.primaryMain}
            textColor={colors.white}
            theme={{ colors: { background: colors.darkSurface } }}
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : null}

          <TextInput
            label="Task Description"
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            mode="outlined"
            style={[styles.input, styles.descriptionInput]}
            multiline
            numberOfLines={4}
            error={!!errors.description}
            outlineColor={colors.gray}
            activeOutlineColor={colors.primaryMain}
            textColor={colors.white}
            theme={{ colors: { background: colors.darkSurface } }}
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}

          <CTButton
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
            disabled={loading}
          >
            {isEditMode ? "Update Task" : "Add Task"}
          </CTButton>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: "auto",
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  errorText: {
    color: colors.errorMain,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
