import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { Bookmark, MapPin } from 'lucide-react-native';

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
  requests: { userId: string; comment: string; status: string }[];
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const isUserInRequests = event.requests.some((request) => request.userId === user?.id);

  return (
    <TouchableOpacity
      className="my-2.5 p-3.5 bg-white rounded-lg border border-gray-200"
      activeOpacity={0.8}
      onPress={() => navigation.navigate('EventInfo', { eventId: event._id })}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-500 text-sm">
          {event.activityAccess === 'public' ? 'Open Event' : 'Private Event'}
        </Text>
        <Bookmark color="black" size={24} />
      </View>

      {/* Avatars & Slots */}
      <View className="mt-2.5">
        <View className="flex-row items-center">
          <View className="flex-row">
            <Image
              source={{ uri: event.organizerUrl || 'https://i.pravatar.cc/100' }}
              className="w-14 h-14 rounded-full"
            />
            <View className="flex-row items-center -ml-1.5">
              {event.participants
                .filter((p) => p.name !== event.organizerName)
                .map((p, index) => (
                  <Image
                    key={index}
                    source={{ uri: p.imageUrl || 'https://i.pravatar.cc/100' }}
                    className="w-11 h-11 rounded-full -ml-1.5 border border-white"
                  />
                ))}
            </View>
          </View>
          <View className="ml-2.5 flex-1">
            <Text className="text-base font-medium">
              • {event.participants.length}/{event.totalParticipants} Going
            </Text>
          </View>
          {!event.matchFull && (
            <View className="bg-[#fffbde] px-2.5 py-1.5 rounded-lg border border-[#EEDC82]">
              <Text className="font-medium text-sm">
                Only {event.totalParticipants - event.participants.length} slots left 🚀
              </Text>
            </View>
          )}
        </View>

        {/* Organizer, Date */}
        <View className="flex-row justify-between items-center mt-2.5">
          <View>
            <Text className="text-gray-500 text-md">
              {event.organizerName} | 321 Karma | On Fire
            </Text>
            <Text className="mt-2.5 text-md font-medium">
              {event.date}, {event.time.split(' - ')[0]}
            </Text>
          </View>
          {event.matchFull && (
            <Image
              source={{ uri: 'https://playo-website.gumlet.io/playo-website-v3/match_full.png' }}
              className="w-[100px] h-[70px]"
              resizeMode="contain"
            />
          )}
        </View>

        {/* Location */}
        <View className="mt-2.5 flex-row items-center gap-1.5">
          <MapPin size={20} color="black" />
          <Text className="text-sm flex-1" numberOfLines={1}>
            {event.location}
          </Text>
        </View>

        {/* Tags */}
        <View className="flex-row justify-between items-center mt-3">
          <View className="bg-gray-200 px-2.5 py-1.5 rounded-md">
            <Text className="text-sm font-normal">All Levels</Text>
          </View>
          {isUserInRequests && (
            <View className="bg-green-600 px-2.5 py-1 rounded-md">
              <Text className="text-white text-sm text-center">Requested</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
