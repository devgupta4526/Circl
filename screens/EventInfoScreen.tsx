import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Share2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

interface Participant {
  _id: string;
  name: string;
  imageUrl: string;
}

interface Event {
  _id: string;
  title: string;
  activity: string;
  location: string;
  date: string;
  time: string;
  description: string;
  participants: Participant[];
  organizer: {
    name: string;
    imageUrl?: string;
  };
}

const EventInfoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { eventId } = route.params as { eventId: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://9.54.133.229:3001/api/event/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <ActivityIndicator className="mt-10" size="large" color="#1f2937" />;

  if (!event) return <Text className="text-center mt-10 text-gray-500">Event not found.</Text>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-[#1f2937]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Share2 color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold text-gray-800">{event.title}</Text>
        <Text className="text-gray-500 mt-1">{event.activity}</Text>

        <TouchableOpacity className="flex-row items-center gap-2 mt-4 bg-green-500 px-3 py-2 rounded-lg">
          <MapPin color="white" size={20} />
          <Text className="text-white">{event.location}</Text>
        </TouchableOpacity>

        <Text className="text-gray-700 mt-4">
          {event.date} | {event.time}
        </Text>

        <Text className="text-gray-800 font-semibold mt-6">Description</Text>
        <Text className="text-gray-600 mt-2">{event.description}</Text>

        <Text className="text-gray-800 font-semibold mt-6">Participants ({event.participants.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 flex-row gap-3">
          {event.participants.map((p) => (
            <View key={p._id} className="items-center">
              <Image source={{ uri: p.imageUrl || 'https://i.pravatar.cc/100' }} className="w-16 h-16 rounded-full" />
              <Text className="text-sm mt-1">{p.name}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventInfoScreen;
