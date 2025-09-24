import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSignUp } from "@clerk/clerk-expo";
import { useUserOnboarding } from "../contexts/UserOnboardingContext";
import axios from "axios";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";

// Typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isLoaded, signUp ,setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, image, interests } = useUserOnboarding();

  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.log("Sign up error:", JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        try {
          const payload = {
            clerkId: signUpAttempt.createdUserId,
            email: emailAddress,
            firstName,
            lastName,
            image,
            interests, // will be filled in onboarding
          };

          // Replace with your real backend URL if different
          const res = await axios.post(
            "http://192.168.1.8:3001/api/users/create-or-update",
            payload
          );

          if (res.data.success) {
            // RootNavigator / Clerk will route user to Main after session activation elsewhere
            // if you need to setActive here, you can do so:
            // await setActive({ session: signUpAttempt.createdSessionId });
            await setActive({ session: signUpAttempt.createdSessionId });
          }
        } catch (err) {
          console.log("User creation error:", err);
        }
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center bg-white px-6">
        <Text className="text-2xl font-bold mb-4 text-center">Verify Your Email</Text>

        <TextInput
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          className="w-full p-3 my-2 border border-gray-300 rounded-xl"
          autoCapitalize="none"
        />

        {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

        <Pressable className="rounded-xl overflow-hidden" onPress={onVerifyPress} disabled={loading}>
          <LinearGradient
            colors={["#14b8a6", "#0d9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-3 rounded-xl"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-base">Verify</Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      {/* App Branding */}
      <View className="items-center mb-6">
        {/* Replace the Image with your logo if you have one */}
        <Image
          source={{
            uri: "https://i.ibb.co/6B0qjvB/delta-logo.png",
          }}
          className="w-20 h-20"
          resizeMode="contain"
        />
        <Text className="text-lg font-semibold mt-2 text-gray-800">Join Delta</Text>
        <Text className="text-sm text-gray-500">Discover and host events effortlessly</Text>
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="mb-1 text-sm text-gray-600">Email</Text>
        <TextInput
          placeholder="Enter your email"
          className="w-full p-3 my-2 border border-gray-300 rounded-xl"
          keyboardType="email-address"
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
      </View>

      {/* Password */}
      <View className="mb-6">
        <Text className="mb-1 text-sm text-gray-600">Password</Text>
        <TextInput
          placeholder="Enter your password"
          className="w-full p-3 my-2 border border-gray-300 rounded-xl"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      {/* Continue (Gradient) */}
      <Pressable className="rounded-xl overflow-hidden mb-4" onPress={onSignUpPress} disabled={loading}>
        <LinearGradient
          colors={["#14b8a6", "#0d9488"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-3 rounded-xl"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-bold text-base">Continue</Text>
          )}
        </LinearGradient>
      </Pressable>

      {/* Go to Sign In */}
      <Pressable onPress={() => navigation.navigate("SignIn")} className="mt-2">
        <Text className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Text className="font-semibold text-[#14b8a6]">Sign In</Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default SignUpScreen;
