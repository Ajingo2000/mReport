import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginUser, signupUser, fetchUserProfile } from '@/store/slices/authSlice';
import { LoginRequest, SignupRequest } from '@/types/api';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => dispatch(loginUser(credentials)).unwrap(),
    onSuccess: () => {
      // Optionally redirect or show success message
    },
  });
};

export const useSignup = () => {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (userData: SignupRequest) => dispatch(signupUser(userData)).unwrap(),
    onSuccess: () => {
      // Optionally redirect to login or show success message
    },
  });
};

export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => dispatch(fetchUserProfile()).unwrap(),
    enabled: isAuthenticated && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};