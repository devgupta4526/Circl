// navigation/EventStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventsScreen from '../screens/EventsScreen';               // previously PlayScreen
import CreateEventScreen from '../screens/CreateEventScreen';     // previously CreateActivityScreen
import SelectTimeScreen from '../screens/SelectTimeScreen';
import TagVenueScreen from '../screens/TagVenueScreen';
import EventDetailsSetupScreen from '../screens/EventDetailsSetupScreen'; // previously GameSetUpScreen
import ParticipantsScreen from '../screens/ParticipantsScreen';   // previously PlayersScreen
import SlotScreen from '../screens/SlotScreen';                   // optional, for multi-slot events
import ManageJoinsScreen from '../screens/ManageJoinsScreen';     // previously ManageRequests
import EventInfoScreen from '../screens/EventInfoScreen';

export type EventStackParamList = {
  EventsHome: undefined;
  CreateEvent: undefined;
  SelectTime: undefined;
  TagVenue: undefined;
  EventDetailsSetup: undefined;
  Participants: { eventId: string };
  Slot?: { eventId: string };
  ManageJoins: { eventId: string };
  EventInfo?: { eventId: string };
};

const Stack = createNativeStackNavigator<EventStackParamList>();

const EventStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsHome" component={EventsScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="SelectTime" component={SelectTimeScreen}/>
      <Stack.Screen name="TagVenue" component={TagVenueScreen}/>
      <Stack.Screen name="EventDetailsSetup" component={EventDetailsSetupScreen}/>
      <Stack.Screen name="Participants" component={ParticipantsScreen}/>
      <Stack.Screen name="Slot" component={SlotScreen}/>
      <Stack.Screen name="ManageJoins" component={ManageJoinsScreen}/>
      <Stack.Screen name="EventInfo" component={EventInfoScreen} />
    </Stack.Navigator>
  );
};

export default EventStackNavigator;
