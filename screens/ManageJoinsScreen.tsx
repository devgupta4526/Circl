import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, PlusSquare, ToggleRight } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';

interface Request {
  userId: string;
  comment: string;
  status: string;
  firstName: string;
  lastName?: string;
  image: string;
}

interface Participant {
  _id: string;
  firstName: string;
  lastName?: string;
  image: string;
}

const ManageJoinsScreen: React.FC = () => {
  const [option, setOption] = useState<'Requests' | 'Invited' | 'Participating' | 'Retired'>('Requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const [matchFull, setMatchFull] = useState(false);
  const { user } = useUser();
  const eventId = (route.params as { eventId?: string })?.eventId;
  const navigation = useNavigation();

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/events/${eventId}/requests`);
      setRequests(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch requests');
    }
  };

  // Fetch participants
  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/events/${eventId}/participants`);
      setParticipants(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch participants');
    }
  };

  const toggleMatchFull = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/events/toggle-match-full', {
        eventId,
        organizerId: user?.id,
      });
      if (response.status === 200) {
        setMatchFull(response.data.matchFull);
        Alert.alert('Success', `Match full status set to ${response.data.matchFull ? 'ON' : 'OFF'}`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to toggle match full');
    }
  };

  // Accept request
  const acceptRequest = async (userId: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/events/accept', {
        eventId,
        userId,
        organizerId: user?.id,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Request accepted');
        await fetchRequests();
        await fetchParticipants();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept request');
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRequests(), fetchParticipants()]);
      setLoading(false);
    };
    if (eventId && user?.id) {
      fetchData();
    } else {
      Alert.alert('Error', 'Missing event ID or user ID');
      setLoading(false);
    }
  }, [eventId, user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#223536] px-4 pt-4 pb-3">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <PlusSquare color="white" size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-white text-xl font-semibold">Manage Joins</Text>
          <TouchableOpacity onPress={toggleMatchFull} className="flex-row items-center gap-2">
            <Text className="text-white text-base">Match Full</Text>
            <ToggleRight color="white" size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between mt-4">
          {['Requests', 'Invited', 'Participating', 'Retired'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setOption(tab as any)}
              className="flex-1"
            >
              <Text
                className={`text-base font-semibold text-center ${
                  option === tab ? 'text-green-400' : 'text-white'
                }`}
              >
                {tab} ({tab === 'Requests' ? requests.length : tab === 'Participating' ? participants.length : 0})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="px-4 pt-4">
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-lg">Loading...</Text>
          </View>
        ) : (
          <>
            {option === 'Requests' && (
              <View>
                {requests.length === 0 ? (
                  <Text className="text-gray-500 text-center mt-10">No pending requests</Text>
                ) : (
                  requests.map((item, index) => (
                    <View
                      key={index}
                      className="bg-white rounded-xl p-4 mb-4 shadow-sm"
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={{ uri: item.image || 'https://i.pravatar.cc/100' }}
                          className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                          <Text className="text-gray-800 font-semibold">
                            {item.firstName} {item.lastName || ''}
                          </Text>
                          <View className="border border-orange-400 rounded-full px-3 py-1 mt-2 self-start">
                            <Text className="text-orange-400 text-xs">INTERMEDIATE</Text>
                          </View>
                        </View>
                      </View>
                      <Text className="text-gray-600 mt-2">{item.comment}</Text>
                      <View className="h-px bg-gray-200 my-3" />
                      <View className="flex-row justify-between items-center">
                        <View>
                          <View className="bg-gray-200 rounded px-3 py-1">
                            <Text className="text-gray-600 text-sm">0 NO SHOWS</Text>
                          </View>
                          <TouchableOpacity>
                            <Text className="text-gray-800 font-semibold underline mt-2">See Reputation</Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex-row gap-3">
                          <TouchableOpacity
                            className="border border-gray-300 rounded-lg px-4 py-2"
                          >
                            <Text className="text-gray-800">RETIRE</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => acceptRequest(item.userId)}
                            className="bg-green-500 rounded-lg px-4 py-2"
                          >
                            <Text className="text-white">ACCEPT</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
            {option === 'Participating' && (
              <View>
                {participants.length === 0 ? (
                  <Text className="text-gray-500 text-center mt-10">No participants yet</Text>
                ) : (
                  participants.map((item, index) => (
                    <View
                      key={index}
                      className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
                    >
                      <Image
                        source={{ uri: item.image || 'https://i.pravatar.cc/100' }}
                        className="w-14 h-14 rounded-full mr-3"
                      />
                      <View>
                        <Text className="text-gray-800 font-semibold">
                          {item.firstName} {item.lastName || ''}
                        </Text>
                        <View className="border border-orange-400 rounded-full px-3 py-1 mt-2 self-start">
                          <Text className="text-orange-400 text-xs">INTERMEDIATE</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
            {option === 'Invited' && (
              <Text className="text-gray-500 text-center mt-10">No invited participants</Text>
            )}
            {option === 'Retired' && (
              <Text className="text-gray-500 text-center mt-10">No retired participants</Text>
            )}
            <View className="h-8" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageJoinsScreen;
