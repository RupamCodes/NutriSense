import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import { useState, useEffect } from 'react';
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
export const useFoodSearch = (query, source = 'NUTRITIONIX') => {
  const debouncedQuery = useDebounce(query, 400);
  return useQuery({
    queryKey: ['foods', 'search', debouncedQuery, source],
    queryFn: async () => {
      const { data } = await axios.get(`/foods/search?q=${debouncedQuery}&source=${source}`);
      return data;
    },
    enabled: debouncedQuery.length > 2,
    staleTime: 5 * 60 * 1000,
  });
};
