import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Text, Button } from "react-native-paper";
import colors from "@App/constants/colors";

interface CTConfirmationPopupProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const CTConfirmationPopup = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: CTConfirmationPopupProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.button}
              disabled={loading}
              textColor={colors.secondaryMain}
              labelStyle={styles.buttonLabel}
            >
              {cancelText}
            </Button>
            <Button
              mode="contained"
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              loading={loading}
              disabled={loading}
              buttonColor={colors.errorMain}
              textColor={colors.white}
              labelStyle={styles.buttonLabel}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkSurface,
    margin: 20,
    borderRadius: 16,
    borderColor: colors.darkBorder,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.darkText,
  },
  message: {
    fontSize: 16,
    color: colors.darkTextSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    minWidth: 100,
    borderRadius: 8,
  },
  confirmButton: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: colors.darkText,
  },
});

export default memo(CTConfirmationPopup);
