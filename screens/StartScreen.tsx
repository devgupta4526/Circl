import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

const StartScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My App 🎉</Text>
      <Text style={styles.subtitle}>Let's get started</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2f",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FF5722",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#4cafef",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
