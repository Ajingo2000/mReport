import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { 
  Report, 
  CreateReportRequest, 
  PaginatedResponse, 
  ReportCounts,
  DamageCounts,
  AssistanceCounts,
  SRHRCounts 
} from '@/types/api';

export const useReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['reports', page, limit],
    queryFn: async (): Promise<PaginatedResponse<Report>> => {
      const response = await apiClient.get(`/csReports/?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateReportRequest): Promise<Report> => {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add images if present
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      const response = await apiClient.post('/add-csReports/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useReportCounts = () => {
  return useQuery({
    queryKey: ['reportCounts'],
    queryFn: async (): Promise<ReportCounts> => {
      const response = await apiClient.get('/report-counts/');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDamageCounts = () => {
  return useQuery({
    queryKey: ['damageCounts'],
    queryFn: async (): Promise<DamageCounts> => {
      const response = await apiClient.get('/damage-counts/');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAssistanceCounts = () => {
  return useQuery({
    queryKey: ['assistanceCounts'],
    queryFn: async (): Promise<AssistanceCounts> => {
      const response = await apiClient.get('/assistance-counts/');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSRHRCounts = () => {
  return useQuery({
    queryKey: ['srhrCounts'],
    queryFn: async (): Promise<SRHRCounts> => {
      const response = await apiClient.get('/srhr-counts/');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};