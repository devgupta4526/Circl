import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import clsx from "clsx";
import { useNavigation } from "@react-navigation/native";
import { useUserOnboarding } from "../contexts/UserOnboardingContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

// Typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const interests = [
  { id: "1", name: "Badminton", image: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg" },
  { id: "2", name: "Cricket", image: "https://images.pexels.com/photos/3800517/pexels-photo-3800517.jpeg" },
  { id: "3", name: "Football", image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg" },
  { id: "4", name: "Tennis", image: "https://images.pexels.com/photos/5836917/pexels-photo-5836917.jpeg" },
  { id: "5", name: "Yoga", image: "https://images.pexels.com/photos/317155/pexels-photo-317155.jpeg" },
  { id: "6", name: "Pickle Ball", image: "https://images.pexels.com/photos/17299530/pexels-photo-17299530.jpeg" },
  { id: "7", name: "Basketball", image: "https://images.pexels.com/photos/1905009/pexels-photo-1905009.jpeg" },
];

const InterestSelectionScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { setInterests } = useUserOnboarding();

  const [localSelected, setLocalSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // const handleNext = () => {
  //   if (localSelected.length === 0) return;
  //   setInterests(localSelected); // store in context
  //   navigation.navigate("SignUp");
  // };

  const handleNext = () => {
    if (localSelected.length === 0) return;

    // map ids to names
    const selectedNames = interests
      .filter((item) => localSelected.includes(item.id))
      .map((item) => item.name);

    setInterests(selectedNames);
    navigation.navigate("SignUp");
  };



  const renderItem = ({ item }: any) => {
    const isSelected = localSelected.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.id)}
        className="mb-6 mr-3 w-[48%]"
      >
        <View
          className={clsx(
            "rounded-xl overflow-hidden",
            isSelected ? "border-2 border-green-500" : "border border-gray-200",
            "bg-gray-100"
          )}
        >
          <Image
            source={{ uri: item.image }}
            className="w-full h-32"
            resizeMode="cover"
          />
          {isSelected && <View className="absolute inset-0 bg-black/30" />}
        </View>
        <Text
          className={clsx(
            "text-center text-base font-medium mt-2",
            isSelected ? "text-green-600" : "text-black"
          )}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="flex-1 bg-white px-6 pt-4"
      style={{ paddingTop: insets.top + 12 }}
    >
      <Text className="text-2xl font-bold text-black mb-2">
        Pick Your Interests
      </Text>
      <Text className="text-base text-gray-500 mb-6">
        Select one or more sports to personalize your experience
      </Text>

      <FlatList
        data={interests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity
          className={clsx(
            "py-4 rounded-xl",
            localSelected.length > 0 ? "bg-green-600" : "bg-gray-300"
          )}
          disabled={localSelected.length === 0}
          onPress={handleNext}
        >
          <Text className="text-white text-center font-semibold text-base">
            {localSelected.length > 0 ? "Continue" : "Select at least one"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InterestSelectionScreen;
