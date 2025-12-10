// api.ts
import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

console.log("API Base:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // REQUIRED for Django cookies + CORS
});

// =============================
// REQUEST INTERCEPTOR
// =============================
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// RESPONSE & TOKEN REFRESH
// =============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = Cookies.get(REFRESH_TOKEN);
      if (!refreshToken) {
        // No refresh token = force logout
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken },
          { withCredentials: true }
        );

        const newAccess = res.data.access;
        Cookies.set(ACCESS_TOKEN, newAccess, {
          secure: process.env.NODE_ENV === "production",
          expires: 1,
        });

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshErr) {
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
