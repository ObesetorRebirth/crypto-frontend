import { useQuery } from '@tanstack/react-query';
import { getUserBalance } from '../services/api';

export const useUserBalance = (userId) => {
  return useQuery({
    queryKey: ['userBalance', userId],
    queryFn: () => getUserBalance(userId),
    enabled: !!userId,
  });
};