import CTConfirmationPopup from "@App/components/CTConfirmationPopup";
import CTHeader from "@App/components/CTHeader";
import asyncAccess from "@App/constants/asyncAccess";
import colors from "@App/constants/colors";
import { screens } from "@App/constants/screens";
import { userActions } from "@App/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@App/redux/store";
import { commonStyles } from "@App/styles/commonStyles";
import type {
  RootStackParamList,
  UserStackNavigationParams,
} from "@App/types/navigation";
import { Task } from "@App/types/task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient"; // Install this if you want gradients: npx expo install expo-linear-gradient
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete React Native Project",
    description:
      "Finish implementing the dark theme and grid layout for the task manager application",
  },
  {
    id: 2,
    title: "Weekly Grocery Shopping",
    description:
      "Buy fruits, vegetables, milk, bread, and other essential items for the week",
  },
  {
    id: 3,
    title: "Morning Workout Routine",
    description:
      "30 mins cardio followed by strength training exercises and stretching",
  },
  {
    id: 4,
    title: "Team Meeting Preparation",
    description:
      "Prepare presentation slides and project status report for tomorrow's team meeting",
  },
  {
    id: 5,
    title: "Read Technical Documentation",
    description:
      "Study the latest React Native documentation updates and new features",
  },
  {
    id: 6,
    title: "Update Portfolio Website",
    description:
      "Add recent projects and update skills section with new technologies",
  },
  {
    id: 7,
    title: "Pay Monthly Bills",
    description:
      "Clear electricity, internet, and water bills before the due date",
  },
  {
    id: 8,
    title: "Schedule Dentist Appointment",
    description:
      "Book a routine checkup appointment with Dr. Smith for next week",
  },
  {
    id: 9,
    title: "Clean Home Office",
    description:
      "Organize desk, clean monitors, and arrange documents in the home office",
  },
  {
    id: 10,
    title: "Learn TypeScript",
    description:
      "Complete the advanced TypeScript course modules on interfaces and generics",
  },
  {
    id: 11,
    title: "Car Maintenance",
    description:
      "Take car for regular service and oil change at the service center",
  },
  {
    id: 12,
    title: "Write Blog Post",
    description:
      "Write an article about recent experiences with React Native development",
  },
];

// Memoized Task Card Component
const TaskCard = memo(
  ({
    task,
    onPress,
    fadeAnim,
  }: {
    task: Task;
    onPress: () => void;
    fadeAnim: Animated.Value;
  }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Card style={styles.taskCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  )
);

// Memoized Add Button Component
const AddButton = memo(
  ({
    onPress,
    scaleAnim,
    handlePressIn,
    handlePressOut,
  }: {
    onPress: () => void;
    scaleAnim: Animated.Value;
    handlePressIn: () => void;
    handlePressOut: () => void;
  }) => (
    <Animated.View
      style={[styles.addButton, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.primaryMain, `${colors.primaryMain}DD`]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <IconButton icon="plus" size={24} iconColor={colors.background} />
          <Text style={styles.addButtonText}>Add New Task</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
);

// Add this component after TaskCard
const UserInfoCard = memo(() => {
  const user = useAppSelector((state) => state.user.userDetails);

  return (
    <Card style={styles.userInfoCard}>
      <Card.Content>
        <View style={styles.userInfoHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userInfoContent}>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userSubtext}>Welcome back!</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
});

// Get screen width for calculating column width
const { width } = Dimensions.get("window");
const COLUMN_GAP = 12;
const PADDING_HORIZONTAL = 16;
const CARD_WIDTH = (width - PADDING_HORIZONTAL * 2 - COLUMN_GAP) / 2;

// Add this new component for the sidebar buttons
const SidebarButtons = ({
  onLogout,
  onAddTask,
}: {
  onLogout: () => void;
  onAddTask: () => void;
}) => (
  <View style={styles.sidebarContainer}>
    <TouchableOpacity
      style={[styles.sidebarButton, styles.addTaskButton]}
      onPress={onAddTask}
    >
      <IconButton icon="note-plus" size={24} iconColor={colors.white} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.sidebarButton} onPress={onLogout}>
      <IconButton icon="logout" size={24} iconColor={colors.errorMain} />
    </TouchableOpacity>
  </View>
);

function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<UserStackNavigationParams, screens.HomeScreen>>();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentPickupLine, setCurrentPickupLine] = useState("");
  const [userName, setUserName] = useState("User");

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    if (route.params?.newTask) {
      setTasks((prev) => [...prev, route.params!.newTask!]);
      navigation.setParams({ newTask: undefined });
    }
  }, [route.params?.newTask]);

  const handleLogoutPress = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    setLoggingOut(true);
    try {
      await AsyncStorage.removeItem(asyncAccess.userDetails);
      dispatch(userActions.reset());
      navigation.replace(screens.AuthStack);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  }, [dispatch, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTasks(initialTasks);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddTask = useCallback(() => {
    navigation.navigate(screens.TaskForm, { mode: "add" });
  }, [navigation]);

  const handleTaskPress = useCallback(
    (task: Task) => {
      navigation.navigate(screens.TaskDetails, { task });
    },
    [navigation]
  );

  const renderTaskCard = ({ item: task }: { item: Task }) => (
    <TouchableOpacity
      onPress={() => handleTaskPress(task)}
      style={styles.taskCard}
    >
      <Text style={styles.taskTitle} numberOfLines={2}>
        {task.title}
      </Text>
      <Text style={styles.taskDescription} numberOfLines={3}>
        {task.description}
      </Text>
    </TouchableOpacity>
  );

  const getRandomPickupLine = useCallback(() => {
    const timeOfDay = new Date().getHours();
    const userName = "User"; // You can get this from your user state/context

    const morningLines = [
      "🌅 Rise and shine! Ready to conquer today's tasks?",
      "☀️ Good morning! Let's make today productive!",
      `🌟 Morning ${userName}! Your tasks are waiting for you!`,
    ];

    const afternoonLines = [
      "⚡️ Keeping the momentum going!",
      "🎯 Stay focused, stay productive!",
      "💪 You're doing great! Keep pushing forward!",
    ];

    const eveningLines = [
      "🌙 Wrapping up for the day?",
      "✨ Time to review your accomplishments!",
      "🎉 Another productive day almost done!",
    ];

    const motivationalQuotes = [
      "🚀 Small progress is still progress!",
      "💫 Your future self will thank you!",
      "⭐️ You've got this!",
      "🎯 Focus on progress, not perfection!",
      "💪 Every task completed is a step forward!",
    ];

    let timeBasedLines;
    if (timeOfDay < 12) {
      timeBasedLines = morningLines;
    } else if (timeOfDay < 17) {
      timeBasedLines = afternoonLines;
    } else {
      timeBasedLines = eveningLines;
    }

    // Combine time-based lines with motivational quotes
    const allLines = [...timeBasedLines, ...motivationalQuotes];
    return allLines[Math.floor(Math.random() * allLines.length)];
  }, []);

  // Add this effect to update pickup line periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPickupLine(getRandomPickupLine());
    }, 2000);

    return () => clearInterval(interval);
  }, [getRandomPickupLine]);

  return (
    <View style={[commonStyles.container, styles.container]}>
      <CTHeader
        title="My Tasks"
        showBack={false}
        subtitle={`You have ${tasks.length} tasks`}
        pickupLine={currentPickupLine}
      />

      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                {`Welcome back${userName ? `, ${userName}` : ""}!`}
              </Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{tasks.length}</Text>
                <Text style={styles.statLabel}>All Tasks</Text>
              </View>
            </View>
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryMain]}
          />
        }
      />

      <SidebarButtons onLogout={handleLogoutPress} onAddTask={handleAddTask} />

      <CTConfirmationPopup
        visible={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout from the app?"
        onConfirm={handleLogoutConfirm}
        onDismiss={handleLogoutCancel}
        confirmText="Logout"
        cancelText="Cancel"
        loading={loggingOut}
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
    flex: 1,
    paddingLeft: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  taskCount: {
    color: `${colors.white}E6`, // Adding transparency
    fontSize: 16,
  },
  appbar: {
    backgroundColor: colors.transparent,
    elevation: 0,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  taskCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.darkSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderColor: colors.darkBorder,
    borderWidth: 1,
    minHeight: 120,
  },
  cardContent: {
    padding: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkText,
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.darkTextSecondary,
    lineHeight: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    elevation: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    borderRadius: 28,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    marginRight: 8,
  },
  userInfoCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: colors.darkSurface,
    borderColor: colors.darkBorder,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  userInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryMain,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfoContent: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkText,
    marginBottom: 4,
  },
  userSubtext: {
    fontSize: 14,
    color: colors.darkTextSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkText,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  horizontalCard: {
    width: 280,
    backgroundColor: colors.darkSurface,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    marginLeft: 4,
    borderColor: colors.darkBorder,
    borderWidth: 1,
    minHeight: 120,
  },
  horizontalTaskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkText,
    marginBottom: 8,
  },
  horizontalTaskDesc: {
    fontSize: 14,
    color: colors.darkTextSecondary,
    lineHeight: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.darkSurface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primaryMain,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.darkTextSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: PADDING_HORIZONTAL,
  },
  columnWrapper: {
    gap: COLUMN_GAP,
    justifyContent: "space-between",
  },
  welcomeContainer: {
    marginBottom: 24,
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: `${colors.white}99`,
    fontWeight: "500",
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
  addTaskButton: {
    backgroundColor: colors.primaryMain,
    borderColor: `${colors.primaryMain}66`,
  },
});

export default memo(HomeScreen);
