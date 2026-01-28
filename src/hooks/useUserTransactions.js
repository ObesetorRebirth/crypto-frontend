import { useQuery } from '@tanstack/react-query';
import { getUserTransactionsByType } from '../services/api';

export const useUserTransactions = (userId, transactionType) => {
  return useQuery({
    queryKey: ['userTransactions', userId, transactionType],
    queryFn: () => getUserTransactionsByType(userId, transactionType),
    enabled: !!userId && !!transactionType,
  });
};