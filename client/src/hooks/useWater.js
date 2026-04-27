import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
export const useWaterLog = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['water', 'today'],
    queryFn: async () => {
      const { data } = await axios.get('/water/today');
      return data;
    }
  });
  const mutation = useMutation({
    mutationFn: async (waterData) => {
      const { data } = await axios.post('/water/log', waterData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water', 'today'] });
    }
  });
  return { query, mutation };
};
