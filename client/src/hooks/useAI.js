import { useQuery, useMutation } from '@tanstack/react-query';
import axios from '../lib/axios';
export const useAISuggestions = () => {
  return useMutation({
    mutationFn: async (context) => {
      const { data } = await axios.post('/ai/meal-suggestions', context);
      return data;
    }
  });
};
export const useDailyTip = () => {
  return useQuery({
    queryKey: ['ai', 'dailyTip'],
    queryFn: async () => {
      const { data } = await axios.get('/ai/daily-tip');
      return data;
    },
    staleTime: 60 * 60 * 1000, 
  });
};
export const useAIInsights = (range) => {
  return useQuery({
    queryKey: ['ai', 'insights', range],
    queryFn: async () => {
      const { data } = await axios.get(`/ai/insights?range=${range}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!range,
  });
};
