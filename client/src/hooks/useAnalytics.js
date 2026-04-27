import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
export const useNutritionAnalytics = (range) => {
  return useQuery({
    queryKey: ['analytics', 'macros', range],
    queryFn: async () => {
      const { data } = await axios.get(`/analytics/macros?range=${range}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useCaloriesTrend = (range) => {
  return useQuery({
    queryKey: ['analytics', 'calories', range],
    queryFn: async () => {
      const { data } = await axios.get(`/analytics/calories?range=${range}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useTopFoods = (range) => {
  return useQuery({
    queryKey: ['analytics', 'topFoods', range],
    queryFn: async () => {
      const { data } = await axios.get(`/analytics/top-foods?range=${range}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
