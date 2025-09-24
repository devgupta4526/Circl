import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserOnboarding } from "../contexts/UserOnboardingContext";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

// Typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SelectImageScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { image, setImage } = useUserOnboarding();

  const avatars = [
    { id: "0", image: "https://cdn-icons-png.flaticon.com/128/16683/16683469.png" },
    { id: "1", image: "https://cdn-icons-png.flaticon.com/128/16683/16683439.png" },
    { id: "2", image: "https://cdn-icons-png.flaticon.com/128/4202/4202835.png" },
    { id: "3", image: "https://cdn-icons-png.flaticon.com/128/3079/3079652.png" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="mt-10 items-center">
          <Text className="text-2xl font-bold text-gray-800">
            Choose Your Avatar 🎭
          </Text>
          <Text className="text-base text-gray-500 mt-2 text-center">
            Select a profile picture to represent you in events
          </Text>
        </View>

        {/* Avatar Options */}
        <View className="flex-row flex-wrap justify-center mt-10">
          {avatars.map((avatar) => (
            <Pressable
              key={avatar.id}
              className={`w-20 h-20 m-2 rounded-full overflow-hidden border-2 ${
                image === avatar.image ? "border-[#14b8a6]" : "border-gray-200"
              }`}
              onPress={() => setImage(avatar.image)}
            >
              <Image source={{ uri: avatar.image }} className="w-full h-full" />
            </Pressable>
          ))}
        </View>

        {/* Custom URL Input */}
        <View className="mt-8 items-center">
          <TextInput
            className="w-4/5 h-12 border border-gray-300 rounded-xl px-4 text-base bg-white mb-3"
            placeholder="Paste image URL (optional)"
            autoCapitalize="none"
            value={image}
            onChangeText={setImage}
          />
          <Text className="text-xs text-gray-500 text-center w-4/5">
            Profiles with a photo are more trusted and engaging ✨
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-6 w-full items-center">
        <Pressable
          onPress={() => navigation.navigate("Interests")}
          disabled={!image}
          className="w-4/5 rounded-xl overflow-hidden"
        >
          <LinearGradient
            colors={image ? ["#14b8a6", "#0d9488"] : ["#9ca3af", "#9ca3af"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-12 items-center justify-center rounded-xl"
          >
            <Text className="text-white font-semibold text-base">Next</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SelectImageScreen;
