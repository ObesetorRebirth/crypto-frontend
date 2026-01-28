import { useQuery } from '@tanstack/react-query';
import { getUserHoldings } from '../services/api';

export const useUserHoldings = (userId) => {
  return useQuery({
    queryKey: ['userHoldings', userId],
    queryFn: () => getUserHoldings(userId),
    enabled: !!userId,
    refetchInterval: 10000,
  });
};