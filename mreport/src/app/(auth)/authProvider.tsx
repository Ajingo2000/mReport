"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/state/api";

// Define expected user structure
interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown; // allows flexibility
}

// Define signup payload structure
interface SignupData {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

// Define context type with specific function signatures
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext)!;

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  // Fetch user from API if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .get("/auth/user/")
        .then((res) => setUser(res.data as User))
        .catch(() => {
          logout(); // invalid token
        });
    }
  }, [logout]); // include logout to fix exhaustive-deps warning

  const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post("/auth/login/", { email, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUser(res.data.user as User);
    router.push("/");
  };

  const signup = async (userData: SignupData): Promise<void> => {
    const res = await api.post("/auth/register/", userData);
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUser(res.data.user as User);
    router.push("/");
  };

  const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    router.push("/signin");
  };

  // Redirect logged-in user away from auth pages
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
