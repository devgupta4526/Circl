import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const EventDetailsSetupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateEvent = () => {
    if (!title || !activity || !date || !time || !location) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    // Navigate to next setup step or save API
    Alert.alert('Event Created', 'Your event has been created successfully!');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 bg-[#1f2937]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">Create Event</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-gray-800 font-semibold">Event Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          className="border border-gray-300 rounded-lg p-3 mt-2"
        />

        <Text className="text-gray-800 font-semibold mt-4">Activity</Text>
        <TextInput
          value={activity}
          onChangeText={setActivity}
          placeholder="e.g., Yoga, Music"
          className="border border-gray-300 rounded-lg p-3 mt-2"
        />

        <Text className="text-gray-800 font-semibold mt-4">Date</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/YYYY"
          className="border border-gray-300 rounded-lg p-3 mt-2"
        />

        <Text className="text-gray-800 font-semibold mt-4">Time</Text>
        <TextInput
          value={time}
          onChangeText={setTime}
          placeholder="HH:MM - HH:MM"
          className="border border-gray-300 rounded-lg p-3 mt-2"
        />

        <Text className="text-gray-800 font-semibold mt-4">Location</Text>
        <TextInput
          value={location}
          onChangeText={
          setLocation}
          placeholder="Enter location"
          className="border border-gray-300 rounded-lg p-3 mt-2"
        />

        <Text className="text-gray-800 font-semibold mt-4">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter event description"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg p-3 mt-2 text-gray-700"
        />

        {/* Create Event Button */}
        <TouchableOpacity
          onPress={handleCreateEvent}
          className="bg-green-600 rounded-lg p-4 mt-6 items-center"
        >
          <Text className="text-white font-semibold text-lg">Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetailsSetupScreen;
