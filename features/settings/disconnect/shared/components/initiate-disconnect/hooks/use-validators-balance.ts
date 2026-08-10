import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { fetchValidators, useVault } from 'modules/vaults';

const VALIDATORS_META_PARAMS = {
  page: 1,
  limit: 1,
  orderBy: 'index',
  direction: 'ASC',
} as const;

export const useValidatorsBalance = () => {
  const { activeVault, queryKeys } = useVault();

  const query = useQuery({
    queryKey: [...queryKeys.base, 'disconnect-validators-balance'] as const,
    enabled: !!activeVault,
    staleTime: 300000,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useValidatorsBalance] activeVault is not defined',
      );

      const { meta } = await fetchValidators(
        activeVault.address,
        VALIDATORS_META_PARAMS,
      );

      return meta;
    },
  });

  const totalBalance = query.data?.totalBalance ?? 0n;

  return {
    ...query,
    isLoading: query.isLoading || query.isPending,
    timestamp: query.data?.timestamp,
    byStatus: query.data?.byStatus,
    hasValidatorsBalance: totalBalance > 0n,
    totalBalance,
  };
};
