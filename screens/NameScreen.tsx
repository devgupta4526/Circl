import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUserOnboarding } from "../contexts/UserOnboardingContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";

// Typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NameScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setFirstName, setLastName } = useUserOnboarding();

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");

  const handleNext = () => {
    if (!firstName.trim()) return;
    setFirstName(firstName.trim());
    setLastName(lastName.trim());
    navigation.navigate("Image");
  };

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      {/* Heading */}
      <Text className="text-2xl font-bold mb-2 text-gray-800">Let’s get to know you 🎉</Text>
      <Text className="text-base text-gray-500 mb-6">Set up your profile to join and host events</Text>

      {/* First Name */}
      <Text className="text-sm mb-1 text-gray-700">First Name *</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirst}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Enter first name"
        autoCapitalize="words"
      />

      {/* Last Name */}
      <Text className="text-sm mb-1 text-gray-700">Last Name (optional)</Text>
      <TextInput
        value={lastName}
        onChangeText={setLast}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        placeholder="Enter last name"
        autoCapitalize="words"
      />

      {/* Next Button - Gradient */}
      <Pressable className="rounded-xl overflow-hidden" onPress={handleNext}>
        <LinearGradient
          colors={["#14b8a6", "#0d9488"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-base">Next</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

export default NameScreen;
