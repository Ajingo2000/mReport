import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Feedback, CreateFeedbackRequest } from '@/types/api';

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateFeedbackRequest): Promise<Feedback> => {
      const response = await apiClient.post('/feedback/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};