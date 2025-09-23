// navigation/HomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import EventDetailScreen from '../screens/EventDetailScreen'; // NEW screen for event details

export type HomeStackParamList = {
  Home: undefined;
  EventDetails: { eventId: string }; // pass eventId when navigating
  ProfileDetails: { userId: string }; // pass userId when navigating
  Chat: { eventId: string }; // optional: chat scoped to event
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
