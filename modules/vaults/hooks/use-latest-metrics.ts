import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { useVault } from '../vault-context';
import { fetchVaultMetrics } from '../api';

export const useVaultLatestMetrics = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.metrics, 'vault-latest-metrics'] as const,
    queryFn: ({ queryKey }) =>
      fetchVaultMetrics({ publicClient }, { vaultAddress: queryKey[1] }),
    enabled: !!activeVault,
    refetchOnMount: false,
  });
};
