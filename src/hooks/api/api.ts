import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuth } from '../useAuth';
import { useToast } from '@/hooks/use-toast'; // Assuming you use this for errors

interface ApiError {
  message: string;
  status?: number;
}

const createApiClient = (getAuth: () => ReturnType<typeof useAuth>) => {
  const api: AxiosInstance = axios.create({
    baseURL: 'https://giraffe-active-forcibly.ngrok-free.app/api/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth headers
  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const { getAuthHeaders } = getAuth();
    return {
      ...config,
      headers: {
        ...config.headers,
        ...getAuthHeaders(),
      },
    };
  });

  // Response interceptor for token refresh and error handling
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      const { refreshAccess, accessToken, refreshToken } = getAuth();

      if (
        error.response?.status === 401 &&
        refreshToken &&
        originalRequest &&
        !originalRequest._retry // Prevent infinite retry loops
      ) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccess(refreshToken);
          if (newAccessToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest); // Retry the original request
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          getAuth().logout(); // Log out if refresh fails
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      const errorMessage =
        (error.response?.data as any)?.detail ||
        error.message ||
        'An error occurred. Please try again.';
      const status = error.response?.status;

      // Trigger toast for user feedback (outside of hook)
      const toast = (window as any).__toast || (() => {}); // Fallback if not in component
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return Promise.reject({ message: errorMessage, status });
    }
  );

  // API Methods
  const signup = async (data: {
    username: string;
    email: string;
    password: string;
    role: string;
    subscriptions: string[];
    category?: string;
    phone_number?: string;
  }) => {
    const response = await api.post('auth/signup/', data);
    return response.data;
  };

  const login = async (username: string, password: string) => {
    const response = await api.post('auth/login/', { username, password });
    return response.data;
  };

  const getUserDetails = async () => {
    const response = await api.get('user-details/');
    return response.data;
  };

  const getReports = async () => {
    const response = await api.get('csReports/');
    return response.data;
  };

  const createReport = async (data: {
    report_type: string;
    damage_type?: string;
    assistance_type?: string;
    srhr_type?: string;
    location: string;
    description: string;
    phone_number?: string;
  }) => {
    const response = await api.post('add-csReports/', data);
    return response.data;
  };

  const submitFeedback = async (data: {
    report: number;
    satisfaction_score: number;
    comments?: string;
  }) => {
    const response = await api.post('feedback/', data);
    return response.data;
  };

  return {
    signup,
    login,
    getUserDetails,
    getReports,
    createReport,
    submitFeedback,
  };
};

// Since useAuth is a hook, we need a way to access it outside React components
// This function wraps the API client creation
export const useApi = () => {
  const auth = useAuth();
  return createApiClient(() => auth);
};

// For non-hook contexts (e.g., interceptors), provide a standalone instance
export const api = createApiClient(() => ({
  getAuthHeaders: () => {
    const access = localStorage.getItem('mreport_access');
    return access ? { Authorization: `Bearer ${access}` } : {};
  },
  refreshAccess: async (refresh: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/refresh/', { refresh });
      const newAccess = response.data.access;
      localStorage.setItem('mreport_access', newAccess);
      return newAccess;
    } catch (error) {
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem('mreport_access');
    localStorage.removeItem('mreport_refresh');
    window.location.href = '/login';
  },
}));