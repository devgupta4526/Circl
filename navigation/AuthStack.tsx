// navigation/AuthStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import NameScreen from "../screens/NameScreen";
import SelectImageScreen from "../screens/SelectImageScreen"; // renamed for clarity
import InterestSelectionScreen from "../screens/InterestSelectionScreen"; // NEW: replaces GameSelection
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";

export type AuthStackParamList = {
  Start: undefined;
  Name: undefined;
  Image: undefined;
  Interests: undefined;
  SignUp: undefined;
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Image" component={SelectImageScreen} />
      <Stack.Screen name="Interests" component={InterestSelectionScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};
