import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, IconButton, Button } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@App/constants/colors";
import { commonStyles } from "@App/styles/commonStyles";
import { screens } from "@App/constants/screens";
import CTHeader from "@App/components/CTHeader";
import CTConfirmationPopup from "@App/components/CTConfirmationPopup";
import { Task } from "@App/types/task";
import { UserStackNavigationParams } from "@App/types/navigation";

type TaskDetailsProps = {
  navigation: NativeStackNavigationProp<
    UserStackNavigationParams,
    screens.TaskDetails
  >;
  route: RouteProp<{ params: { task: Task } }, "params">;
};

export default function TaskDetails({ navigation, route }: TaskDetailsProps) {
  const { task } = route.params;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    navigation.navigate(screens.TaskForm, { task, mode: "edit" });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigation.navigate(screens.HomeScreen, { deletedTaskId: task.id });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <CTHeader
        title="Task Details"
        onBack={() => navigation.goBack()}
        rightIcon="pencil"
        onRightPress={handleEdit}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.taskContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.sidebarContainer}>
        <TouchableOpacity
          style={[styles.sidebarButton, styles.editButton]}
          onPress={handleEdit}
        >
          <IconButton icon="pencil" size={24} iconColor={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sidebarButton}
          onPress={() => setShowDeleteConfirm(true)}
        >
          <IconButton icon="delete" size={24} iconColor={colors.errorMain} />
        </TouchableOpacity>
      </View>

      <CTConfirmationPopup
        visible={showDeleteConfirm}
        onDismiss={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
  header: {
    paddingTop: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 16,
  },
  editButton: {
    backgroundColor: colors.primaryMain,
    borderColor: colors.primaryMain,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    backgroundColor: colors.darkSurface,
    borderRadius: 16,
    padding: 20,
    borderColor: colors.darkBorder,
    borderWidth: 1,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  taskDescription: {
    fontSize: 16,
    color: `${colors.white}CC`,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  sidebarContainer: {
    position: "absolute",
    right: 16,
    bottom: 24,
    alignItems: "center",
    gap: 12,
  },
  sidebarButton: {
    backgroundColor: colors.darkSurface,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
});
