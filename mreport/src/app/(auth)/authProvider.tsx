"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/state/api";

interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    router.push("/signin");
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .get("/auth/user/")
        .then((res) => setUser(res.data))
        .catch(() => {
          logout();
        });
    }
  }, [logout]);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post("/auth/login/", { email, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUser(res.data.user);
    router.push("/");
  };

  const signup = async (userData: SignupData): Promise<void> => {
    const res = await api.post("/auth/register/", userData);
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUser(res.data.user);
    router.push("/");
  };

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
