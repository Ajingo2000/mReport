'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { AuthService } from '@/lib/services';
import { User } from '@/lib/services';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------
  // Load user from backend if token exists
  // -------------------------------------------------
  const loadUser = useCallback(async () => {
    const access = Cookies.get(ACCESS_TOKEN);
    if (!access) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await AuthService.getUserProfile();
      setUser(profile);
    } catch (error) {
      // Token expired or invalid
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------
  // Login handler
  // -------------------------------------------------
  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    if (data) {
      await loadUser(); // refresh user immediately after login
    }
  };

  // -------------------------------------------------
  // Logout handler
  // -------------------------------------------------
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  // -------------------------------------------------
  // Refresh user manually (used after email verification)
  // -------------------------------------------------
  const refreshUser = async () => {
    await loadUser();
  };

  // -------------------------------------------------
  // Load user on initial mount
  // -------------------------------------------------
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
