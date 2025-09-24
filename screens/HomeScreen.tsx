import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, MessageCircle } from "lucide-react-native";
import { useUserStore } from "../stores/userStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStackNavigator";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const spotlightData = [
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg",
    text: "Morning Yoga",
    description: "Find your balance 🧘‍♀️",
  },
  {
    id: "2",
    image:
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
    text: "Weekend Football",
    description: "Join the squad ⚽",
  },
  {
    id: "3",
    image:
      "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
    text: "Music Jam",
    description: "Vibe together 🎶",
  },
];

const HomeScreen = () => {
  const { user } = useUserStore();
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-200 bg-white">
        <View>
          <Text className="text-xs text-gray-400">Location</Text>
          <Text className="text-lg font-semibold text-black">
            Bengaluru, India
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <MessageCircle
            onPress={() => navigation.navigate("Chat", { eventId: "global" })}
            size={22}
            stroke="#333"
          />
          <Bell size={22} stroke="#333" />
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileDetails", { userId: user?._id || "" })
            }
          >
            <Image
              source={{ uri: user?.image }}
              className="w-9 h-9 rounded-full"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Fit Goal / Motivation */}
        <View className="bg-[#F4F4F5] rounded-2xl p-4 mt-4 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold">
              Set Your Weekly Goal 🔥
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Stay consistent, stay fit!
            </Text>
          </View>
          <Text className="text-3xl">➡️</Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mt-5">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDetails", { eventId: "new" })
            }
            className="w-[48%] bg-teal-500 rounded-2xl p-4"
          >
            <Text className="text-white text-lg font-semibold">
              + Create Event
            </Text>
            <Text className="text-white/80 text-sm mt-1">
              Host an activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDetails", { eventId: "discover" })
            }
            className="w-[48%] bg-indigo-500 rounded-2xl p-4"
          >
            <Text className="text-white text-lg font-semibold">🔍 Discover</Text>
            <Text className="text-white/80 text-sm mt-1">
              Join trending events
            </Text>
          </TouchableOpacity>
        </View>

        {/* My Events Section */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mt-5 shadow-sm">
          <Text className="text-sm font-semibold text-gray-500">My Events</Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-base text-gray-700">
              Check upcoming activities
            </Text>
            <TouchableOpacity
              className="bg-teal-600 px-4 py-1.5 rounded-md"
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: "calendar" })
              }
            >
              <Text className="text-white font-semibold">Calendar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDetails", { eventId: "qr" })
            }
            className="mt-3 self-center"
          >
            <Text className="text-indigo-600 font-semibold underline text-sm">
              Join via QR Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spotlight */}
        <Text className="text-xl font-bold mt-6 mb-2">Spotlight</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {spotlightData.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="mr-4 bg-white rounded-xl w-48 overflow-hidden shadow-sm"
            >
              <Image
                source={{ uri: item.image }}
                className="w-full h-56"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-bold text-teal-700 text-base">
                  {item.text}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Events */}
        <Text className="text-xl font-bold mt-6 mb-3">Recommended Events</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {[1, 2, 3].map((id) => (
            <TouchableOpacity
              key={id}
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: `${id}` })
              }
              className="mr-4 bg-white rounded-2xl w-48 border border-gray-200 shadow-sm overflow-hidden"
            >
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/220264/pexels-photo-220264.jpeg",
                }}
                className="w-full h-28"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-bold text-gray-800">
                  Yoga in the Park
                </Text>
                <Text className="text-xs text-gray-500">
                  Tomorrow • 7:00 AM
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Community Feed */}
        <Text className="text-xl font-bold mt-6 mb-3">Community Feed</Text>
        <View className="space-y-4">
          <View className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: user?.image }}
                className="w-10 h-10 rounded-full"
              />
              <View>
                <Text className="font-semibold text-gray-800">
                  Rahul Sharma
                </Text>
                <Text className="text-xs text-gray-500">
                  Shared an update
                </Text>
              </View>
            </View>
            <Text className="mt-3 text-gray-700">
              Amazing football match today! ⚽🔥 Thanks to everyone who joined!
            </Text>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
              }}
              className="w-full h-48 rounded-xl mt-3"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Reputation */}
        <View className="bg-[#F9FAFB] rounded-2xl p-4 mt-6 flex-row items-center">
          <View className="bg-teal-100 p-3 rounded-full mr-3">
            <Text className="text-xl">⭐</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-base">Your Reputation</Text>
            <Text className="text-sm text-gray-600">Level 3 • 240 points</Text>
          </View>
          <TouchableOpacity className="px-3 py-1.5 bg-teal-600 rounded-md">
            <Text className="text-white text-sm font-semibold">View</Text>
          </TouchableOpacity>
        </View>

        {/* Invite Friends */}
        <View className="bg-[#F9FAFB] rounded-2xl p-4 flex-row items-center mt-4">
          <View className="bg-indigo-100 p-3 rounded-full mr-3">
            <Text className="text-xl">🎁</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-base">Invite Friends</Text>
            <Text className="text-sm text-gray-600">
              Earn <Text className="text-indigo-600">50 points</Text> per invite
            </Text>
          </View>
          <TouchableOpacity className="px-3 py-1.5 bg-indigo-600 rounded-md">
            <Text className="text-white text-sm font-semibold">Invite</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mb-10 mt-6">
          <Text className="text-2xl font-bold text-teal-600">DELTA</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Redefining Social Activities
          </Text>
          <View className="flex-row items-center space-x-2 mt-2">
            <TouchableOpacity>
              <Text className="text-sm text-blue-500 underline">
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-400">•</Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-500 underline">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-400">•</Text>
            <TouchableOpacity>
              <Text className="text-sm text-blue-500 underline">FAQs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
