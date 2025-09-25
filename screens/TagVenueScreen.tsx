import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const TagVenueScreen = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { onVenueSelected } = route.params || {}; // Callback from CreateEventScreen

  useEffect(() => {

    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://192.168.1.102:3001/api/venues');
        setVenues(response.data);
      } catch (error: any) {
        console.error('Failed to fetch venues:', error.message);
      }
    };

    fetchVenues();
  }, []);

  const handleSelectVenue = (venue: any) => {
    if (onVenueSelected) {
      onVenueSelected(venue); // Update taggedVenue in CreateEventScreen
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 bg-[#294461] pb-6">
        <View className="flex-row items-center space-x-3">
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
            onPress={() => navigation.goBack()}
          />
          <Text className="text-white font-medium text-base">Tag Venue</Text>
        </View>
      </View>

      {/* Venue List */}
      <FlatList
        data={venues}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectVenue(item)}
            className="border border-gray-200 m-3 p-3 rounded-lg bg-white shadow-sm"
          >
            <View className="flex-row gap-4">
              <Image
                source={{ uri: item?.image }}
                className="w-[90px] h-[90px] rounded-md"
              />
              <View className="flex-1 justify-center space-y-1 pr-2">
                <Text className="text-base font-semibold" numberOfLines={1}>
                  {item?.name}
                </Text>
                <Text className="text-gray-500">{item?.location || "Unknown location"}</Text>
                <Text className="font-medium text-sm text-gray-700">
                  {item?.rating ? `${item.rating} (${item.ratingCount} reviews)` : "No ratings yet"}
                </Text>
              </View>
              {item?.verified && (
                <Ionicons name="shield-checkmark-sharp" size={24} color="green" />
              )}
            </View>
            {item?.isBookable && (
              <Text className="text-center text-gray-400 mt-3">BOOKABLE</Text>
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default TagVenueScreen;
