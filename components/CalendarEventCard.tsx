import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUser } from '@clerk/clerk-expo';

// Interfaces
interface Participant {
  _id: string;
  imageUrl: string;
  name: string;
}

interface Event {
  _id: string;
  activity: string;
  location: string;
  date: string;
  time: string;
  activityAccess: string;
  totalParticipants: number;
  participants: Participant[];
  matchFull: boolean;
  organizerName: string;
  organizerUrl?: string;
  isBooked: boolean;
  courtNumber?: string;
  requests: { userId: string; comment: string; status: string }[];
  userRequestStatus?: string;
}

interface CalendarEventCardProps {
  event: Event;
  onCancelRequest?: () => void;
}

const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ event, onCancelRequest }) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const isPending = event.userRequestStatus === 'pending';

  const handleCancelRequest = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `http://9.54.133.229:3001/api/events/${event._id}/cancel-request`,
        { userId: user.id }
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Request cancelled successfully', [
          { text: 'OK', onPress: () => onCancelRequest && onCancelRequest() },
        ]);
      }
    } catch (error: any) {
      console.error('Error cancelling request:', error.message);
      Alert.alert('Error', 'Failed to cancel request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="p-4 bg-white rounded-xl mb-4 shadow-md"
      activeOpacity={0.8}
      onPress={() => navigation.navigate('EventInfo', { eventId: event._id })}
      disabled={loading}
    >
      {/* Date Header */}
      <Text className="text-green-600 text-base font-medium mb-3 border-b border-gray-100 pb-2">
        {event.date}
      </Text>

      {isPending ? (
        <View className="flex-row items-center gap-3">
          {/* Organizer Image */}
          <Image
            source={{ uri: event.organizerUrl || 'https://i.pravatar.cc/100' }}
            className="w-12 h-12 rounded-full border border-gray-100"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              {event.organizerName}'s {event.activity} Event
            </Text>
            <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>
              {event.location}
            </Text>
            <Text className="text-yellow-600 font-medium text-sm">
              Awaiting Host Confirmation
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Participants: {event.participants.length} / {event.totalParticipants}
            </Text>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            className="bg-red-600 p-2 rounded-lg"
            onPress={handleCancelRequest}
            disabled={loading}
          >
            <Text className="text-white text-sm font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: event.organizerUrl || 'https://i.pravatar.cc/100' }}
            className="w-12 h-12 rounded-full border border-gray-100"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              {event.organizerName}'s {event.activity} Event
            </Text>
            <Text className="text-gray-500 text-sm mb-2">{event.location}</Text>
            <View className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
              {event.isBooked ? (
                <>
                  <Text className="text-center text-gray-700 font-medium text-xs mb-1">
                    Court {event.courtNumber}
                  </Text>
                  <Text className="text-center bg-green-600 text-white text-sm font-medium py-1.5 rounded-md">
                    Booked
                  </Text>
                </>
              ) : (
                <Text className="text-center text-gray-700 font-medium text-sm">
                  {event.time}
                </Text>
              )}
            </View>
            {event.matchFull && (
              <Image
                source={{
                  uri: 'https://playo-website.gumlet.io/playo-website-v3/match_full.png',
                }}
                className="w-[100px] h-[70px] mt-2 self-center"
                resizeMode="contain"
              />
            )}
          </View>
          <View className="items-center justify-center">
            <Text className="text-2xl font-bold text-green-600">
              {event.participants.length}
            </Text>
            <Text className="text-sm font-medium text-gray-600 mt-1">GOING</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CalendarEventCard;
