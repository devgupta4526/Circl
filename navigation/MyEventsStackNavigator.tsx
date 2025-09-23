// navigation/MyEventsStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyEventsScreen from '../screens/MyEventsScreen';            // previously BookScreen
import EventInfoScreen from '../screens/EventInfoScreen';          // previously VenueInfoScreen
import SlotScreen from '../screens/SlotScreen';
import CreateEventScreen from '../screens/CreateEventScreen';      // previously CreateActivityScreen

export type MyEventsStackParamList = {
  MyEventsHome: undefined;
  EventInfo: {
    eventId: string;
    name: string;
    description: string;
    location: string;
    time: string;
    organizer: { id: string; name: string };
    participants: any[];
  };
  Slot?: {
    eventId: string;
    slots: any[];
  };
  CreateEvent: { area?: string };
};

const Stack = createNativeStackNavigator<MyEventsStackParamList>();

const MyEventsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyEventsHome" component={MyEventsScreen} />
      <Stack.Screen name="EventInfo" component={EventInfoScreen} />
      <Stack.Screen
        name="Slot"
        component={SlotScreen}
        options={{ tabBarStyle: { display: 'none' } }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ tabBarStyle: { display: 'none' } }}
      />
    </Stack.Navigator>
  );
};

export default MyEventsStackNavigator;
