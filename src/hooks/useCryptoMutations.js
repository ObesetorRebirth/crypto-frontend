import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buyCrypto, sellCrypto, resetUserAccount, getUserBalance } from '../services/api';


export const useBuyCrypto = (onSuccess) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, cryptoId, quantity }) => buyCrypto(userId, cryptoId, quantity),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      queryClient.invalidateQueries({ queryKey: ['userHoldings'] });
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
      
      if (onSuccess) {
        try {
          const newBalance = await getUserBalance(variables.userId);
          onSuccess(newBalance);
        } catch (error) {
          console.error('Error fetching updated balance:', error);
        }
      }
    },
  });
};


export const useSellCrypto = (onSuccess) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, cryptoId, quantity }) => sellCrypto(userId, cryptoId, quantity),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      queryClient.invalidateQueries({ queryKey: ['userHoldings'] });
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
      
      if (onSuccess) {
        try {
          const newBalance = await getUserBalance(variables.userId);
          onSuccess(newBalance);
        } catch (error) {
          console.error('Error fetching updated balance:', error);
        }
      }
    },
  });
};

export const useResetAccount = (onSuccess) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => resetUserAccount(userId),
    onSuccess: () => {

      queryClient.invalidateQueries();
      
      if (onSuccess) {
        onSuccess(10000);
      }
    },
  });
};