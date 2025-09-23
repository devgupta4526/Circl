import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import { RouteProp } from '@react-navigation/native';
import EventStackNavigator from './EventStackNavigator';   // new stack for Events
import HomeStackNavigator from './HomeStackNavigator';
import MyEventsStackNavigator from './MyEventsStackNavigator'; // new stack for managing joined/created events

type TabParamList = {
  Home: undefined;
  Events: undefined;
  MyEvents: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<TabParamList, keyof TabParamList>;
      }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: string = '';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Events') iconName = 'people';     // for event discovery
          else if (route.name === 'MyEvents') iconName = 'calendar'; // for joined/created events
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#34C759",
        tabBarInactiveTintColor: "#666666",
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Events" component={EventStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="MyEvents" component={MyEventsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
