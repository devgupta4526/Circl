import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSignIn } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import GoogleSignIn from "../components/GoogleSignIn";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

// Typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        setError("Sign-in incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors[0]?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Logo / Branding */}
      <View className="items-center mb-6">
        <Text className="text-4xl font-extrabold text-[#14b8a6] tracking-wide">
          Δ DELTA
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Discover • Connect • Experience
        </Text>
      </View>

      {/* Welcome Message */}
      <Text className="text-2xl font-bold text-gray-800 mb-1">
        Welcome Back 👋
      </Text>
      <Text className="text-base text-gray-500 mb-6">
        Sign in to explore events near you
      </Text>

      {/* Input Fields */}
      <TextInput
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email or Phone"
        placeholderTextColor="#aaa"
        className="w-full p-3 my-2 border border-gray-300 rounded-xl"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        className="w-full p-3 my-2 border border-gray-300 rounded-xl"
      />

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      {/* Sign In Button */}
      <Pressable onPress={onSignInPress} className="w-full rounded-xl mt-2">
        <LinearGradient
          colors={["#14b8a6", "#0d9488"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-3 rounded-xl flex-row justify-center items-center"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          ) : (
            <Text className="text-white text-center font-semibold text-md">
              Sign In
            </Text>
          )}
        </LinearGradient>
      </Pressable>

      {/* OR divider */}
      <View className="flex-row items-center w-full my-4">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      {/* Google Login Button */}
      <GoogleSignIn />

      {/* Bottom SignUp link */}
      <Pressable
        onPress={() => navigation.navigate("SignUp")}
        className="mt-6"
      >
        <Text className="text-gray-500">
          Don’t have an account?{" "}
          <Text className="text-[#14b8a6] font-semibold">Sign Up</Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;
