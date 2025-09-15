// Updated: src/hooks/useAuth.ts
// Changes:
// 1. In useSignup: Since responders might need /register-responder/, added optional params for phone_number, category.
//    If role=='responder', switch endpoint and adjust payload.
//    Assumes SignupRequest extended temporarily; in practice, create separate hook or form.
// 2. In useUserProfile: Enabled if authenticated (even if user exists), but staleTime to avoid frequent fetches.
//    On success, if role=='responder', could fetch /responder-details/, but kept simple.
// 3. useLogin unchanged, as optimized in thunk.

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginUser, signupUser, fetchUserProfile, logout } from '@/store/slices/authSlice';
import { LoginRequest, SignupRequest } from '@/types/api';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => dispatch(loginUser(credentials)).unwrap(),
    onSuccess: () => {
      // Optionally: window.location.href = '/dashboard'; or use navigate
    },
  });
};

export const useSignup = () => {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: async (userData: SignupRequest & { phone_number?: string; category?: string }) => {
      if (userData.role === 'responder') {
        // Use /register-responder/ for responders
        const responderData = {
          user: {
            username: userData.username,
            email: userData.email,
            password: userData.password,
          },
          phone_number: userData.phone_number,
          category: userData.category || 'damage',  // Default or required
        };
        const response = await apiClient.post('/register-responder/', responderData);
        return response.data;
      } else {
        return dispatch(signupUser(userData)).unwrap();
      }
    },
    onSuccess: () => {
      // Optionally auto-login or redirect
    },
  });
};

export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => dispatch(fetchUserProfile()).unwrap(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: () => {
      dispatch(logout()); // Logout on failure
    },
  });
};