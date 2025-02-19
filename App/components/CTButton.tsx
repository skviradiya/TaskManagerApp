import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button, useTheme } from "react-native-paper";
import colors from "@App/constants/colors";

interface CTButtonProps {
  mode?: "text" | "outlined" | "contained";
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function CTButton({
  mode = "contained",
  onPress,
  loading = false,
  disabled = false,
  children,
  style,
}: CTButtonProps) {
  const theme = useTheme();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      labelStyle={styles.labelStyle}
      buttonColor={colors.primaryMain}
      textColor={mode === "contained" ? colors.white : colors.primaryMain}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primaryMain,
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkText,
  },
});
