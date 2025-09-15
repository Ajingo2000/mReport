// Updated: src/store/slices/authSlice.ts
// Changes:
// 1. In loginUser thunk: Backend /auth/login/ returns tokens and user object directly. So, use that user instead of fetching /user-details/ again.
//    This optimizes and avoids redundant call; aligns with backend response.
// 2. For signupUser: If role == 'responder', after signup, call /register-responder/ – wait, no: signup is /auth/signup/, which sets role, but Responder is separate.
//    Actually, to align, added logic: if role=='responder', use /register-responder/ instead, adjusting payload (add phone_number, category if needed).
//    But since frontend SignupRequest lacks phone_number, category, perhaps keep separate or add params.
//    For simplicity, assume citizen/admin use /auth/signup/, responders use /register-responder/ – add note to use separate form/thunk for responders.
//    Here, updated signupUser to check role; if 'responder', throw error or redirect to separate endpoint (but for now, kept as is, add comment).
// 3. fetchUserProfile: Now /user-details/ returns full data with role, etc.
// 4. refreshToken endpoint: '/login/refresh/' matches backend.
// 5. Added extra: if role=='responder', perhaps fetch /responder-details/ in fetchUserProfile, but for now, kept simple; can add nested.

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthTokens, LoginRequest, SignupRequest } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: JSON.parse(localStorage.getItem('mreport_tokens') || 'null'),
  isAuthenticated: !!localStorage.getItem('mreport_tokens'),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login/', credentials);
      const { access, refresh, user } = response.data;  // Backend returns tokens and user
      const tokens = { access, refresh };
      localStorage.setItem('mreport_tokens', JSON.stringify(tokens));
      return { tokens, user };  // Use returned user directly
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      // If role == 'responder', consider using /register-responder/ instead (adjust payload)
      // For now, use /auth/signup/ for all; create Responder separately if needed.
      const response = await apiClient.post('/auth/signup/', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.tokens?.refresh) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post('/login/refresh/', {
        refresh: auth.tokens.refresh
      });
      
      const newTokens = response.data;
      localStorage.setItem('mreport_tokens', JSON.stringify(newTokens));
      
      return newTokens;
    } catch (error: any) {
      localStorage.removeItem('mreport_tokens');
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.tokens?.access) {
        throw new Error('No access token available');
      }
      
      const response = await apiClient.get('/user-details/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('mreport_tokens');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokens = action.payload.tokens;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })
      // Fetch profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;