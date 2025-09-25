import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import moment from "moment";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import axios from "axios";
import { useUserStore } from "../stores/userStore";

const CreateEventScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [activityAccess, setActivityAccess] = useState<"Public" | "Invite Only">("Public");
  const [totalParticipants, setTotalParticipants] = useState("");
  const [taggedVenue, setTaggedVenue] = useState<{ name: string } | null>(null);
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Venue selection callback
  const handleVenueSelected = (venue: { name: string }) => {
    setTaggedVenue(venue);
  };

  // Time selection callback
  const handleTimeSelected = (interval: string) => {
    setTime(interval);
  };

  // Generate next 10 dates
  const generateDates = () =>
    Array.from({ length: 10 }).map((_, i) => {
      const d = moment().add(i, "days");
      return {
        id: i.toString(),
        displayDate:
          i === 0 ? "Today" : i === 1 ? "Tomorrow" : i === 2 ? "Day after" : d.format("Do MMMM"),
        dayOfWeek: d.format("dddd"),
        actualDate: d.format("YYYY-MM-DD"),
      };
    });

  const dates = generateDates();

  // Create Event API
  const createEvent = async () => {
    if (!activity || !date || !time || !totalParticipants || !taggedVenue) {
      Alert.alert("Missing Fields", "Please fill all the required fields before creating.");
      return;
    }

    try {
      const response = await axios.post("http://9.54.133.229:3001/api/event/create", {
        activity,
        location: taggedVenue.name,
        date,
        time,
        organizer: user?._id,
        totalParticipants: Number(totalParticipants),
        participants: [user?._id],
        activityAccess: activityAccess.toLowerCase(),
        instructions: additionalInstructions,
      });

      if (response.status === 200) {
        Alert.alert("Success!", "Event created successfully", [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => navigation.goBack() },
        ]);

        // Reset form
        setActivity("");
        setDate("");
        setTime("");
        setTotalParticipants("");
        setTaggedVenue(null);
        setAdditionalInstructions("");
      }
    } catch (err: any) {
      console.error("Failed to create event:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4">
        {/* Back button */}
        <Pressable onPress={() => navigation.goBack()} className="py-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        <Text className="text-2xl font-bold mt-2">Create Event</Text>

        {/* Activity */}
        <Pressable
          onPress={() => navigation.navigate("Activity")}
          className="flex-row items-center gap-4 mt-6"
        >
          <MaterialCommunityIcons name="whistle" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Activity</Text>
            <TextInput
              value={activity}
              onChangeText={setActivity}
              placeholder="Eg Running / Football / Cricket"
              placeholderTextColor="gray"
              className="mt-1 text-base"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        {/* Location */}
        <Pressable
          onPress={() => navigation.navigate("TagVenue", { onVenueSelected: handleVenueSelected })}
          className="flex-row items-center gap-4"
        >
          <Entypo name="location" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Location</Text>
            <TextInput
              value={taggedVenue?.name || ""}
              editable={false}
              placeholder="Locality or venue name"
              placeholderTextColor="gray"
              className="mt-1 text-base text-black"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        {/* Date */}
        <Pressable onPress={() => setModalVisible(true)} className="flex-row items-center gap-4">
          <Feather name="calendar" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Date</Text>
            <TextInput
              editable={false}
              value={date}
              placeholder="Pick a Day"
              placeholderTextColor="gray"
              className="mt-1 text-base text-black"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        {/* Time */}
        <Pressable
          onPress={() => navigation.navigate("SelectTime", { onTimeSelected: handleTimeSelected })}
          className="flex-row items-center gap-4"
        >
          <AntDesign name="clockcircleo" size={24} color="gray" />
          <View className="flex-1">
            <Text className="text-lg font-medium">Time</Text>
            <TextInput
              value={time}
              editable={false}
              placeholder="Pick Exact Time"
              placeholderTextColor="gray"
              className="mt-1 text-base text-black"
            />
          </View>
          <AntDesign name="arrowright" size={24} color="gray" />
        </Pressable>

        <View className="border-b border-gray-300 my-4" />

        {/* Access type */}
        <Text className="text-lg font-medium mt-4 mb-2">Activity Access</Text>
        <View className="flex-row gap-4">
          {["Public", "Invite Only"].map((type) => (
            <Pressable
              key={type}
              onPress={() => setActivityAccess(type as "Public" | "Invite Only")}
              className={`flex-row items-center justify-center px-4 py-2 rounded-md w-36 ${activityAccess === type ? "bg-green-600" : "bg-white border border-gray-300"
                }`}
            >
              {type === "Public" ? (
                <Ionicons
                  name="earth"
                  size={24}
                  color={activityAccess === type ? "white" : "black"}
                />
              ) : (
                <AntDesign
                  name="lock1"
                  size={24}
                  color={activityAccess === type ? "white" : "black"}
                />
              )}
              <Text
                className={`ml-2 text-base font-bold ${activityAccess === type ? "text-white" : "text-black"
                  }`}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Participants */}
        <Text className="text-base font-medium mt-6">Total Participants</Text>
        <TextInput
          value={totalParticipants}
          onChangeText={setTotalParticipants}
          keyboardType="numeric"
          className="mt-2 p-3 bg-white border border-gray-300 rounded-md"
          placeholder="Total Participants (including you)"
        />
        {/* Instructions */}
        <Text className="text-base font-medium mt-6">Add Instructions</Text>
        <View className="bg-gray-100 p-4 rounded-md mt-2 space-y-3">
          {[
            { icon: "bag-check", text: "Bring your own equipment", color: "red" },
            { icon: "directions-fork", text: "Cost Shared", color: "#FEBE10" },
            { icon: "syringe", text: "Covid Vaccinated participants preferred", color: "green" },
          ].map(({ icon, text, color }, idx) => (
            <View key={idx} className="flex-row items-center gap-2">
              {icon === "syringe" ? (
                <FontAwesome5 name={icon} size={20} color={color} />
              ) : (
                <MaterialCommunityIcons name={icon} size={24} color={color} />
              )}
              <Text className="flex-1 text-base font-medium">{text}</Text>
              <FontAwesome name="check-square" size={20} color="green" />
            </View>
          ))}

          {/* Additional instructions input */}
          <TextInput
            value={additionalInstructions}
            onChangeText={setAdditionalInstructions}
            className="p-3 bg-white border border-gray-300 rounded-md mt-2"
            placeholder="Add Additional Instructions"
          />
        </View>


        {/* Create button */}
        <Pressable className="bg-green-600 mt-8 py-3 rounded-md" onPress={createEvent}>
          <Text className="text-white text-center font-semibold text-base">Create Event</Text>
        </Pressable>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-white rounded-t-2xl p-4 max-h-[75%]">
          <Text className="text-center text-lg font-bold py-2">Choose date</Text>
          <View className="flex-row flex-wrap gap-3 px-2">
            {dates.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => {
                  setDate(d.actualDate);
                  setModalVisible(false);
                }}
                className="w-[30%] border border-gray-300 rounded-md items-center py-2"
              >
                <Text>{d.displayDate}</Text>
                <Text className="text-gray-500 mt-1 text-sm">{d.dayOfWeek}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateEventScreen;
