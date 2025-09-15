import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { SupportTicket, CreateSupportTicketRequest, PaginatedResponse } from '@/types/api';

export const useSupportTickets = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['supportTickets', page, limit],
    queryFn: async (): Promise<PaginatedResponse<SupportTicket>> => {
      const response = await apiClient.get(`/support/?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSupportTicketRequest): Promise<SupportTicket> => {
      const response = await apiClient.post('/support/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
    },
  });
};