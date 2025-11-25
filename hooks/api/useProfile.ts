import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, ResponderDetails, UpdateProfileRequest } from '@/types/api';
import { useAppDispatch } from '@/hooks';
import { updateUser } from '@/store/slices/authSlice';


export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest): Promise<User> => {
      const response = await api.put('/users/update/', data, {
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // update React Query cache
      queryClient.setQueryData(['userProfile'], updatedUser);
      
      // update Redux
      dispatch(updateUser(updatedUser));
    },
  });
};

export const useResponderDetails = () => {
  return useQuery({
    queryKey: ['responderDetails'],
    queryFn: async (): Promise<ResponderDetails> => {
      const response = await api.get('/responder-details/');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if user is not a responder
  });
};