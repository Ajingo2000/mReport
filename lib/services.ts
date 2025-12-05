// services.ts
import Cookies from "js-cookie";
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

// =============================
// TYPES
// =============================
export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
}



export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization?: string | null;
  email_verified: boolean;
  role: string;
  subscriptions: ('srhr' | 'gbv')[]; // user can subscribe to one or both
  pofile_picture?: string | null
  created_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  needs_verification?: boolean;   // ← ADD THIS LINE
  message?: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
  email: string;
}



// =============================
// BASE URL
// =============================
const baseURL = "/auth";

// =============================
// COOKIE OPTIONS
// =============================
const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

// =============================
// SERVICE OBJECT
// =============================
export const AuthService = {
  // -----------------------------
  // REGISTER
  // -----------------------------
  register: async (userData: RegisterData) => {
    try {
      const res = await api.post<RegisterResponse>(
        `${baseURL}/register/`,
        userData
      );
      return res.data;
    } catch (error) {
      console.log("Error in AuthService.register:", error);
      throw error;
    }
  },

  // -----------------------------
  // LOGIN
  // -----------------------------
  login: async (email: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>(`${baseURL}/login/`, {
        email,
        password,
      });

      if (res.status === 200) {
        const { access, refresh } = res.data;

        // Save JWT in cookies
        Cookies.set(ACCESS_TOKEN, access, {
          ...cookieOptions,
          expires: 1,
        });

        Cookies.set(REFRESH_TOKEN, refresh, {
          ...cookieOptions,
          expires: 7,
        });

        return res.data;
      }
    } catch (error) {
      console.log("Error in AuthService.login:", error);
      throw error;
    }
  },

  // -----------------------------
  // VERIFY EMAIL
  // -----------------------------
  verifyEmail: async (token: string) => {
    try {
      const res = await api.get(`${baseURL}/verify-email/${token}/`);

      if (res.status === 200) {
        const { access, refresh } = res.data;

        Cookies.set(ACCESS_TOKEN, access, {
          ...cookieOptions,
          expires: 1,
        });
        Cookies.set(REFRESH_TOKEN, refresh, {
          ...cookieOptions,
          expires: 7,
        });
      }

      return res.data;
    } catch (error) {
      console.log("Error verifying email:", error);
      throw error;
    }
  },

  // -----------------------------
  // RESEND VERIFICATION EMAIL
  // -----------------------------
  resendVerificationEmail: async (email: string) => {
    try {
      const res = await api.post(`${baseURL}/resend-verification/`, { email });
      return res.data;
    } catch (error) {
      console.log("Error resending verification email:", error);
      throw error;
    }
  },

  // -----------------------------
  // GET USER PROFILE
  // -----------------------------
  getUserProfile: async () => {
    try {
      const res = await api.get<User>(`${baseURL}/profile/`);
      return res.data;
    } catch (error) {
      console.log("Error getting profile:", error);
      throw error;
    }
  },

  // -----------------------------
  // LOGOUT
  // -----------------------------
  logout: async () => {
    try {
      await api.post(`${baseURL}/logout/`, {
        refresh_token: Cookies.get(REFRESH_TOKEN),
      });
    } catch (err) {
      console.log("Error during logout:", err);
    } finally {
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
    }
  },
};
