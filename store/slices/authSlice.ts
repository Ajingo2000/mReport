import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthTokens, LoginRequest, SignupRequest, SubscriptionType } from '@/types/api';
import api  from '@/lib/api';


interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentSubscription: SubscriptionType;
}

const initialState: AuthState = {
  user: null,
  tokens: JSON.parse(localStorage.getItem('mreport_tokens') || 'null'),
  isAuthenticated: !!localStorage.getItem('mreport_tokens'),
  isLoading: false,
  error: null,
  currentSubscription: 'All',
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      const tokens = response.data;
      localStorage.setItem('mreport_tokens', JSON.stringify(tokens));
      
      // Fetch user details after successful login
      const userResponse = await api.get('/user-details/', {
        headers: { Authorization: `Bearer ${tokens.access}` }
      });
      
      return { tokens, user: userResponse.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup/', userData);
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
      
      const response = await api.post('/login/refresh/', {
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
      
      const response = await api.get('/user-details/', {
        headers: { Authorization: `Bearer ${auth.tokens.access}` }
      });
      
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
    setCurrentSubscription: (state, action: PayloadAction<SubscriptionType>) => {
      state.currentSubscription = action.payload;
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
        // Set default subscription based on user's first subscription
        if (action.payload.user.subscriptions.length > 0) {
          state.currentSubscription = action.payload.user.subscriptions[0];
        }
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

export const { logout, clearError, updateUser, setCurrentSubscription } = authSlice.actions;
export default authSlice.reducer;