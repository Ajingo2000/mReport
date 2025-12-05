// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthTokens, LoginRequest, SignupRequest } from '@/types/api';
import { SubscriptionType } from '@/types/api';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN } from '@/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentSubscription: SubscriptionType;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check auth
  error: null,
  currentSubscription: 'All',
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      const { user } = response.data;

      // Cookies are set by backend (httpOnly) — we just return user
      return { user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
   'auth/register',
   async (data: SignupRequest, { rejectWithValue }) => {
     try {
       const res = await api.post('/auth/register/', data);
       return res.data;
     } catch (error: any) {
       return rejectWithValue(error.response?.data);
     }
   }
 );

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>('/auth/profile/');
      return response.data;
    } catch (error: any) {
      // If 401, user is not authenticated
      return rejectWithValue('Unauthorized');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout/', {});
  // Cookies will be cleared by backend
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSubscription: (state, action: PayloadAction<SubscriptionType>) => {
      state.currentSubscription = action.payload;
    },
    // ADD THESE TWO BACK:
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.currentSubscription = 'All';
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
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;

        // Set default subscription
        if (action.payload.user.subscriptions.length > 0) {
          state.currentSubscription = action.payload.user.subscriptions[0];
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })

      // Fetch Profile (on app load)
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

        if (action.payload.subscriptions.length > 0) {
          state.currentSubscription = action.payload.subscriptions[0];
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.currentSubscription = 'All';
      });
  },
});


export const {
  clearError,
  setCurrentSubscription,
  logout,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;

