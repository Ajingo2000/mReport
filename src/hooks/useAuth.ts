import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  subscriptions: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('mreport_token');
    if (token) {
      // Verify token with backend
      verifyToken(token);
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('https://giraffe-active-forcibly.ngrok-free.app/api/auth/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          isAuthenticated: true,
          user: userData.user,
          token,
          loading: false
        });
      } else {
        // Token invalid, remove it
        localStorage.removeItem('mreport_token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false
        });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('mreport_token');
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('https://giraffe-active-forcibly.ngrok-free.app/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token;
      localStorage.setItem('mreport_token', token);
      
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        token,
        loading: false
      });

      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('mreport_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
    navigate('/login');
  };

  const getAuthHeaders = () => {
    const token = authState.token || localStorage.getItem('mreport_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  return {
    ...authState,
    login,
    logout,
    getAuthHeaders
  };
};