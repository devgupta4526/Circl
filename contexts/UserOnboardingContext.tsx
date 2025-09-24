import React, { createContext, useContext, useState } from "react";

type UserOnboarding = {
  firstName: string;
  lastName?: string;
  image: string;
  interests: string[];      // renamed from sports
  sessionId: string;
  setSessionId: (id: string) => void;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setImage: (uri: string) => void;
  setInterests: (list: string[]) => void;  // renamed from setSports
};

const UserOnboardingContext = createContext<UserOnboarding | null>(null);

export const UserOnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [interests, setInterests] = useState<string[]>([]); // renamed from sports
  const [sessionId, setSessionId] = useState("");

  return (
    <UserOnboardingContext.Provider
      value={{
        firstName,
        lastName,
        image,
        interests,
        setFirstName,
        setLastName,
        setImage,
        setInterests,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </UserOnboardingContext.Provider>
  );
};

export const useUserOnboarding = () => {
  const ctx = useContext(UserOnboardingContext);
  if (!ctx) throw new Error("UserOnboardingContext must be used within a provider");
  return ctx;
};
