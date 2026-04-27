import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
export const useCurrentPlan = () => {
  return useQuery({
    queryKey: ['plans', 'current'],
    queryFn: async () => {
      const { data } = await axios.get('/plans/current');
      return data;
    }
  });
};
export const useWeeklyPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileContext) => {
      const { data } = await axios.post('/ai/weekly-plan', profileContext);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    }
  });
};
export const useShoppingList = (planId) => {
  return useQuery({
    queryKey: ['plans', planId, 'shoppingList'],
    queryFn: async () => {
      const { data } = await axios.get(`/plans/${planId}/shopping-list`);
      return data;
    },
    enabled: !!planId,
  });
};
