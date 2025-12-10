"use client";

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginUser, signupUser, fetchUserProfile } from '@/store/slices/authSlice';
import { LoginRequest, SignupRequest } from '@/types/api';
import api from '@/lib/api';


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
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile/');
      return res.data;
    },
    enabled: typeof window !== 'undefined', // ← ONLY RUN ON CLIENT
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};