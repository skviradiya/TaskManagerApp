import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UserStack() {
  return (
    <View style={styles.container}>
      <Text>UserStack</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
