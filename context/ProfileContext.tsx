import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const PROFILE_KEY = 'fighterProfile';

export type FighterProfile = {
  name: string;
  age: string;
  height: string;
  weight: string;
  reach: string;
  experience: string;
  goal: string;
  style: string;
};

type ProfileContextType = {
  profile: FighterProfile | null;
  profileLoaded: boolean;
  saveProfile: (p: FighterProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  profileLoaded: false,
  saveProfile: async () => {},
  clearProfile: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FighterProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (raw) setProfile(JSON.parse(raw));
      setProfileLoaded(true);
    });
  }, []);

  async function saveProfile(p: FighterProfile) {
    setProfile(p);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }

  async function clearProfile() {
    setProfile(null);
    await AsyncStorage.removeItem(PROFILE_KEY);
  }

  return (
    <ProfileContext.Provider value={{ profile, profileLoaded, saveProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
