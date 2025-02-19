import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@App/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CTHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  subtitle?: string;
  pickupLine?: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

const CTHeader = ({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  subtitle,
  pickupLine,
  showLogout = false,
  onLogout,
}: CTHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.darkSurface, `${colors.darkSurface}95`]}
      style={[styles.header, { paddingTop: insets.top }]}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <IconButton
                icon="arrow-left"
                size={28}
                iconColor={colors.white}
                style={styles.iconButton}
              />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {pickupLine && <Text style={styles.pickupLine}>{pickupLine}</Text>}
          </View>
        </View>

        {showLogout && (
          <TouchableOpacity
            onPress={onLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <IconButton
              icon="logout"
              size={24}
              iconColor={colors.errorMain}
              style={styles.iconButton}
            />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.darkSurface,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.darkBorder}20`,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: `${colors.white}99`,
    fontSize: 14,
    marginTop: 2,
  },
  pickupLine: {
    color: colors.primaryMain,
    fontSize: 16,
    marginTop: 4,
    fontStyle: "italic",
  },
  backButton: {
    borderRadius: 20,
  },
  logoutButton: {
    borderRadius: 20,
    backgroundColor: `${colors.errorMain}10`,
    marginLeft: "auto",
    padding: 4,
  },
  iconButton: {
    margin: 0,
  },
});

export default CTHeader;
