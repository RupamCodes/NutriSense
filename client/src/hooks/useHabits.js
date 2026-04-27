import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
export const useHabits = () => {
  return useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data } = await axios.get('/habits');
      return data;
    }
  });
};
export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (habitData) => {
      const { data } = await axios.post('/habits', habitData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    }
  });
};
export const useCompleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (habitId) => {
      const { data } = await axios.post(`/habits/${habitId}/complete`);
      return data;
    },
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: ['habits', 'streaks'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habits', 'streaks'] });
    }
  });
};
export const useHabitStreaks = () => {
  return useQuery({
    queryKey: ['habits', 'streaks'],
    queryFn: async () => {
      const { data } = await axios.get('/habits/streaks');
      return data;
    }
  });
};
