import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";

// Typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const mapView = useRef<MapView | null>(null);

  const highlights = [
    {
      image:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=800",
      description: "Startup Meetup",
    },
    {
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800",
      description: "Music Jam",
    },
    {
      image:
        "https://images.unsplash.com/photo-1515165562835-c4c4e011a7b7?q=80&w=800",
      description: "Tech Talk",
    },
    {
      image:
        "https://images.unsplash.com/photo-1503424886306-0f205731bd5d?q=80&w=800",
      description: "Art Showcase",
    },
    {
      image:
        "https://images.unsplash.com/photo-1549921296-3a48a7bfb9da?q=80&w=800",
      description: "Food Fest",
    },
    {
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=800",
      description: "Dance Night",
    },
  ];

  const BANGALORE_COORDS = {
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const generateCircularPoints = (
    center: { latitude: number; longitude: number },
    radius: number,
    numPoints: number
  ) => {
    const points = [];
    const angleStep = (2 * Math.PI) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const latitude = center.latitude + (radius / 111) * Math.cos(angle);
      const longitude = center.longitude + (radius / (111 * Math.cos(center.latitude * (Math.PI / 180)))) * Math.sin(angle);
      points.push({ latitude, longitude });
    }

    return points;
  };

  const circularPoints = generateCircularPoints(BANGALORE_COORDS, 5, 6);

  useEffect(() => {
    if (mapView.current) {
      mapView.current.fitToCoordinates(circularPoints, {
        edgePadding: { top: 70, bottom: 70, left: 70, right: 70 },
        animated: true,
      });
    }
  }, []);

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        {/* Map with Event Highlights */}
        <MapView
          ref={mapView}
          style={{ width: "100%", height: 400 }}
          initialRegion={{
            latitude: BANGALORE_COORDS.latitude,
            longitude: BANGALORE_COORDS.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {circularPoints.map((point, index) => {
            const highlight = highlights[index % highlights.length];
            return (
              <Marker key={index} coordinate={point}>
                <View className="items-center justify-center">
                  <Image
                    source={{ uri: highlight.image }}
                    className="w-[70px] h-[70px] rounded-full border-4 border-white shadow-md"
                    resizeMode="cover"
                  />
                </View>
                <View className="bg-white px-3 py-2 rounded-xl mt-2 shadow-md">
                  <Text className="text-sm font-semibold text-center text-gray-800">
                    {highlight.description}
                  </Text>
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* Title Section */}
        <View className="mt-10 items-center justify-center px-8">
          <Text className="text-3xl font-extrabold text-center text-black">
            Discover Events Near You 🎉
          </Text>
          <Text className="text-gray-600 text-base mt-4 text-center leading-6">
            Join communities, connect with people & create experiences together
          </Text>
        </View>

        {/* Login Link */}
        <Pressable
          onPress={() => navigation.navigate("SignIn")}
          className="mt-8 items-center justify-center"
        >
          <Text className="text-base text-gray-500">
            Already have an account?{" "}
            <Text className="text-[#14b8a6] font-semibold">Login</Text>
          </Text>
        </Pressable>

        {/* Delta Branding */}
        <View className="items-center justify-center mt-8">
          <Text className="text-4xl font-extrabold text-[#14b8a6] tracking-wide">
            Δ DELTA
          </Text>
          <Text className="text-sm text-gray-500 mt-2">
            Discover • Connect • Experience
          </Text>
        </View>
      </SafeAreaView>

      {/* Bottom CTA */}
      <View className="bg-white px-6 pb-8 pt-4 border-t border-gray-100 shadow-lg">
        <Pressable
          onPress={() => navigation.navigate("Name")}
          className="rounded-lg overflow-hidden"
        >
          <LinearGradient
            colors={["#14b8a6", "#0d9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-4 rounded-lg"
          >
            <Text className="text-white text-lg font-bold text-center tracking-wide">
              Get Started
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </>
  );
};

export default StartScreen;
