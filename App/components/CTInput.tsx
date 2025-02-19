import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import colors from "@App/constants/colors";

interface CTInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
}

export default function CTInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
  numberOfLines = 1,
}: CTInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        mode="outlined"
        style={[styles.input, multiline && styles.multilineInput]}
        outlineColor={colors.darkBorder}
        activeOutlineColor={colors.primaryMain}
        textColor={colors.darkText}
        placeholderTextColor={colors.darkTextSecondary}
        theme={{
          colors: {
            background: colors.darkSurface,
            placeholder: colors.darkTextSecondary,
            error: colors.errorMain,
          },
        }}
      />
      {error && (
        <HelperText type="error" style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.darkSurface,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: colors.errorMain,
    marginTop: 4,
  },
});
