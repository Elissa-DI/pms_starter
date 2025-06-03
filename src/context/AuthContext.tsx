/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/lib/types";
import {
  getCurrentUser,
  isAuthenticated,
  forgotPassword,
  resetPassword,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (otp: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to get user:");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Load user on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn: user !== null,
    setUser,
    refreshUser,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
