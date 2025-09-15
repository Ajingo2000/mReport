import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { refreshToken, logout } from '@/store/slices/authSlice';

// Base API configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.tokens?.access;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const state = store.getState();
      const refreshTokenValue = state.auth.tokens?.refresh;
      
      if (refreshTokenValue) {
        try {
          await store.dispatch(refreshToken());
          const newState = store.getState();
          const newToken = newState.auth.tokens?.access;
          
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;