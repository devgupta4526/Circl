import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { AuthStack } from "./navigation/AuthStack";
import RootNavigator from "./navigation/RootNavigator";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator/>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
