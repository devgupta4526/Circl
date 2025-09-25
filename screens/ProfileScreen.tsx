import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar,
  Users,
  Wallet,
  Settings,
  Gift,
  Book,
  Share2,
  HelpCircle,
  LogOut,
  Edit,
} from "lucide-react-native";
import { useUserStore } from "../stores/userStore";
import { useClerk } from "@clerk/clerk-expo";

const ProfileScreen: React.FC = () => {
  const { user } = useUserStore();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // RootNavigator will redirect to SignIn automatically
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        {/* Header */}
        <View className="bg-[#294461] p-4 pb-8">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ uri: user?.image || "https://i.pravatar.cc/100" }}
                className="w-16 h-16 rounded-full mr-4"
              />
              <View>
                <Text className="text-white text-xl font-bold">
                  {user?.firstName}
                </Text>
                <Text className="text-white text-sm">150 Karma Points</Text>
              </View>
            </View>
            <TouchableOpacity className="p-2">
              <Edit color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Section */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            {[
              {
                icon: <Calendar color="green" size={24} />,
                title: "My Bookings",
                subtitle: "View Transactions & Receipts",
              },
              {
                icon: <Users color="green" size={24} />,
                title: "Playpals",
                subtitle: "View & Manage Players",
              },
              {
                icon: <Wallet color="green" size={24} />,
                title: "Passbook",
                subtitle: "Manage Karma, Playo Credits, etc",
              },
              {
                icon: <Settings color="green" size={24} />,
                title: "Preference and Privacy",
                subtitle: "Manage Your Settings",
              },
            ].map((item, index, arr) => (
              <View key={item.title}>
                <TouchableOpacity className="flex-row items-center py-3">
                  <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                    {item.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 text-base font-semibold">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < arr.length - 1 && (
                  <View className="h-px bg-gray-200 my-2" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Secondary Section */}
        <View className="px-4 mt-4 mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            {[
              {
                icon: <Gift color="green" size={24} />,
                title: "Offers",
                subtitle: "View Available Discounts",
              },
              {
                icon: <Book color="green" size={24} />,
                title: "Blogs",
                subtitle: "Read Latest Articles",
              },
              {
                icon: <Share2 color="green" size={24} />,
                title: "Invite & Earn",
                subtitle: "Refer Friends for Rewards",
              },
              {
                icon: <HelpCircle color="green" size={24} />,
                title: "Help & Support",
                subtitle: "Get Assistance",
              },
            ].map((item, index, arr) => (
              <View key={item.title}>
                <TouchableOpacity className="flex-row items-center py-3">
                  <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                    {item.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 text-base font-semibold">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < arr.length - 1 && (
                  <View className="h-px bg-gray-200 my-2" />
                )}
              </View>
            ))}

            {/* Logout */}
            <View>
              <View className="h-px bg-gray-200 my-2" />
              <TouchableOpacity
                onPress={handleSignOut}
                className="flex-row items-center py-3"
              >
                <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-4">
                  <LogOut color="red" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-red-600 text-base font-semibold">
                    Logout
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Sign Out of Your Account
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
