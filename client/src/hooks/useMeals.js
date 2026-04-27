import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { useMealStore } from '../store/useMealStore';
export const useTodayMeals = () => {
  return useQuery({
    queryKey: ['meals', 'today'],
    queryFn: async () => {
      const { data } = await axios.get('/meals/today');
      return data;
    },
    staleTime: 30 * 1000,
  });
};
export const useMealSummary = (date) => {
  return useQuery({
    queryKey: ['meals', 'summary', date],
    queryFn: async () => {
      const { data } = await axios.get(`/meals/summary?date=${date}`);
      return data;
    },
    staleTime: 30 * 1000,
    enabled: !!date,
  });
};
export const useMealLogs = (date, range) => {
  return useQuery({
    queryKey: ['meals', date, range],
    queryFn: async () => {
      const { data } = await axios.get(`/meals?date=${date}&range=${range}`);
      return data;
    },
    staleTime: 60 * 1000,
  });
};
export const useLogMeal = () => {
  const queryClient = useQueryClient();
  const addLog = useMealStore((state) => state.addLog);
  const removeLog = useMealStore((state) => state.removeLog);
  return useMutation({
    mutationFn: async (mealData) => {
      const { data } = await axios.post('/meals/log', mealData);
      return data;
    },
    onMutate: async (newMeal) => {
      await queryClient.cancelQueries({ queryKey: ['meals'] });
      const tempId = Date.now().toString();
      const optimisticMeal = { ...newMeal, id: tempId, isOptimistic: true, food: newMeal.food || {} };
      addLog(optimisticMeal);
      const previousTodayMeals = queryClient.getQueryData(['meals', 'today']);
      if (previousTodayMeals) {
        queryClient.setQueryData(['meals', 'today'], [...previousTodayMeals, optimisticMeal]);
      }
      return { tempId, previousTodayMeals };
    },
    onError: (err, newMeal, context) => {
      if (context?.tempId) {
        removeLog(context.tempId);
      }
      if (context?.previousTodayMeals) {
        queryClient.setQueryData(['meals', 'today'], context.previousTodayMeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals', 'summary'] });
    },
  });
};
export const useDeleteMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/meals/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['meals'] });
      const previousMeals = queryClient.getQueryData(['meals', 'today']);
      if (previousMeals) {
        queryClient.setQueryData(['meals', 'today'], previousMeals.filter(m => m.id !== id));
      }
      return { previousMeals };
    },
    onError: (err, id, context) => {
      if (context?.previousMeals) {
        queryClient.setQueryData(['meals', 'today'], context.previousMeals);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};
