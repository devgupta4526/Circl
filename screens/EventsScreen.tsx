import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, MessageCircle, Filter, SlidersHorizontal } from 'lucide-react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import EventCard from '../components/EventCard';
import CalendarEventCard from '../components/CalendarEventCard';
import { useUserStore } from '../stores/userStore';

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
  isInProgress?: boolean;
  userRequestStatus?: string;
}

const EventsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUserStore();

  const [selectedCategory, setSelectedCategory] = useState<'Calendar' | 'Recommended' | 'My Events' | 'Past Events'>(
    route.params?.initialTab === 'Calendar' ? 'Calendar' : 'My Events'
  );
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = 'http://9.54.133.229:3001/api/event';
      if (selectedCategory === 'Calendar') {
        endpoint += '/upcoming';
      } else {
        endpoint += '/events';
      }

      const params: any = {};
      if (selectedCategory === 'Calendar') params.userId = user?._id;

      const url = `${endpoint}?${new URLSearchParams(params).toString()}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Error fetching events: ${res.status}`);

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Fetch events error', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, user?._id]);

  useFocusEffect(useCallback(() => {
    fetchEvents();
  }, [fetchEvents]));

  const filteredEvents = useMemo(() => {
    return selectedFilter === 'All' ? events : events.filter(e => e.activity === selectedFilter);
  }, [events, selectedFilter]);

  const displayEvents = useMemo(() => {
    const now = moment();
    if (selectedCategory === 'Past Events') {
      return filteredEvents.filter(event => moment(event.date).isBefore(now));
    }
    if (selectedCategory === 'Calendar') {
      return filteredEvents.filter(event => moment(event.date).isSameOrAfter(now, 'day'));
    }
    return filteredEvents;
  }, [filteredEvents, selectedCategory]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#1f2937] pb-3">
        <View className="px-4 pt-3 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-300 text-sm">{moment().format('h:mm A')}</Text>
            <Text className="text-white text-lg font-semibold">Bengaluru, India</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MessageCircle color="white" size={22} />
            <Bell color="white" size={22} />
            <Image source={{ uri: user?.image || 'https://i.pravatar.cc/100' }} className="w-9 h-9 rounded-full" />
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 px-4">
          {['Calendar', 'Recommended', 'My Events', 'Past Events'].map(item => (
            <TouchableOpacity key={item} className="mr-6" onPress={() => setSelectedCategory(item as any)}>
              <Text className={`text-base font-bold ${selectedCategory === item ? 'text-green-400' : 'text-white'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 px-4">
          {['All', 'Music', 'Fitness', 'Yoga', 'Arts', 'Tech'].map(filter => (
            <TouchableOpacity
              key={filter}
              className={`mr-3 px-4 py-2 rounded-full flex-row items-center gap-2 ${
                selectedFilter === filter ? 'bg-green-500' : 'bg-white border border-gray-200'
              }`}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text className="text-base font-semibold">{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Create Event + Filters */}
      <View className="bg-white px-4 py-3 flex-row justify-between items-center border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateEvent', { refresh: true })}
          className="bg-gray-100 px-4 py-2 rounded-xl"
        >
          <Text className="text-base font-semibold text-gray-800">+ Create Event</Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <SlidersHorizontal size={22} color="#1f2937" />
          <Filter size={22} color="#1f2937" />
        </View>
      </View>

      {/* Event Cards */}
      <ScrollView className="px-4 pt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#1f2937" className="mt-10" />
        ) : displayEvents.length === 0 ? (
          <Text className="mt-10 text-center text-gray-500 text-lg font-medium">
            No events under "{selectedCategory}"
          </Text>
        ) : (
          displayEvents.map(event =>
            selectedCategory === 'Calendar' ? (
              <CalendarEventCard key={event._id} event={event} onCancelRequest={fetchEvents} />
            ) : (
              <EventCard key={event._id} event={event} />
            )
          )
        )}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;
