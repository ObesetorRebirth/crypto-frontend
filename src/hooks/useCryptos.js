import { useQuery } from '@tanstack/react-query';
import { getTop20Cryptos } from '../services/api';

export const useCryptos = () => {
  return useQuery({
    queryKey: ['cryptos'],
    queryFn: getTop20Cryptos,
    refetchInterval: 4000,
    staleTime: 3000,
  });
};