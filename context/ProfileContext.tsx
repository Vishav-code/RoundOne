import React, { createContext, useContext, useState } from 'react';

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
  saveProfile: (p: FighterProfile) => void;
  clearProfile: () => void;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  saveProfile: () => {},
  clearProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FighterProfile | null>(null);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        saveProfile: (p) => setProfile(p),
        clearProfile: () => setProfile(null),
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
