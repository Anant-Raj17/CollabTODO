"use client";

import React, {
  createContext,
  useContext,
  useState,
  //useEffect
} from "react";

type User = {
  id: string;
  username: string;
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfilePicture: (imageUrl: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Simulate authentication
  const login = async (
    username: string,
    // password: string
  ) => {
    // In a real app, this would make an API call
    setUser({
      id: Date.now().toString(),
      username,
      profilePicture: undefined,
    });
  };

  const signup = async (
    username: string,
    // password: string
  ) => {
    // In a real app, this would make an API call
    setUser({
      id: Date.now().toString(),
      username,
      profilePicture: undefined,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfilePicture = (imageUrl: string) => {
    if (user) {
      setUser({ ...user, profilePicture: imageUrl });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfilePicture }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
