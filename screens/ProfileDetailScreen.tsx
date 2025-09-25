import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../stores/userStore";

const ProfileDetailScreen: React.FC = () => {
  const { user } = useUserStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* 🏷 Profile Card */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row items-center gap-4">
            <Image
              source={{ uri: user?.image || "https://i.pravatar.cc/150?img=32" }}
              className="w-16 h-16 rounded-full"
            />
            <View>
              <Text className="text-xl font-semibold">
                {user?.firstName} {user?.lastName || ""}
              </Text>
              <Text className="text-gray-500 text-sm">
                Joined {new Date(user?.createdAt || "").toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* 📊 Stats */}
          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="text-xl font-bold">{user?.eventCount || 0}</Text>
              <Text className="text-gray-500 text-sm">EVENTS</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold">
                {user?.connections?.length || 0}
              </Text>
              <Text className="text-gray-500 text-sm">CONNECTIONS</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold">
                {user?.skill || "—"}
              </Text>
              <Text className="text-gray-500 text-sm">SKILL</Text>
            </View>
          </View>
        </View>

        {/* 🎯 Weekly Goal */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4 flex-row items-center">
          <View className="bg-red-100 p-2 rounded-full">
            <Text className="text-red-500 text-lg">🔥</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-base">
              Set your Weekly Fit Goal 🎯
            </Text>
            <Text className="text-gray-500 text-sm">
              Stay consistent by setting a weekly activity goal.
            </Text>
            <TouchableOpacity>
              <Text className="text-green-600 mt-1 font-semibold">Set Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🏃 Active Level */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-base">Active Level</Text>
            <Text className="text-green-600">Learn More</Text>
          </View>
          <View className="flex-row justify-between mt-4">
            <Text className="text-orange-400">Warming Up</Text>
            <Text className="text-cyan-400">Active</Text>
            <Text className="text-purple-400">Super Active</Text>
            <Text className="text-red-400">On Fire</Text>
          </View>
        </View>

        {/* 🏅 Reputation Badges */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row justify-between mb-4">
            <Text className="font-semibold text-base">Reputation Badges</Text>
            <TouchableOpacity>
              <Text className="text-green-600">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {(user?.badges || [
              { icon: "⏰", label: "Punctual", count: 10 },
              { icon: "👥", label: "Team Player", count: 15 },
            ]).map((badge, i) => (
              <View
                key={i}
                className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4 w-[48%] items-center"
              >
                <View className="bg-blue-100 p-4 rounded-full mb-2">
                  <Text className="text-blue-600 text-xl">{badge.icon}</Text>
                </View>
                <Text className="text-center font-medium text-gray-800">
                  {badge.label} ({badge.count})
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 📈 Leaderboard */}
        <View className="bg-gradient-to-r from-blue-50 to-white mx-4 mt-4 rounded-2xl shadow p-4">
          <View className="flex-row justify-between mb-4">
            <Text className="font-semibold text-base text-gray-800">
              Leaderboard
            </Text>
            <TouchableOpacity>
              <Text className="text-green-600">View Leaderboard</Text>
            </TouchableOpacity>
          </View>
          {/* Replace with API-driven leaderboard */}
          <View className="space-y-2">
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="text-gray-700 font-medium">🏸 Badminton</Text>
              <Text className="text-gray-900 font-semibold">#12</Text>
            </View>
            <View className="flex-row justify-between items-center border-b border-gray-200 pb-2">
              <Text className="text-gray-700 font-medium">⚽ Football</Text>
              <Text className="text-gray-900 font-semibold">#7</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetailScreen;
