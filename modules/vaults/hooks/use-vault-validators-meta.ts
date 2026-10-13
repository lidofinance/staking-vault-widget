import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { fetchValidators, useVault } from 'modules/vaults';

// The validators endpoint returns aggregates (total balance, counts by status,
// off-book deposits) in `meta` alongside the paginated list. Consumers that only
// need those aggregates — the overview metrics and modals — use this hook and
// ask for the smallest possible page instead of pulling the whole table.
const VALIDATORS_META_PARAMS = {
  page: 1,
  limit: 1,
  orderBy: 'index',
  direction: 'ASC',
} as const;

export const useVaultValidatorsMeta = () => {
  const { activeVault, queryKeys } = useVault();

  const query = useQuery({
    queryKey: [...queryKeys.base, 'vault-validators-meta'] as const,
    enabled: !!activeVault && !activeVault.isVaultDisconnected,
    staleTime: 300000, // 5 min, same as the validators list
    queryFn: async () => {
      invariant(
        activeVault,
        '[useVaultValidatorsMeta] activeVault is not defined',
      );

      return fetchValidators(activeVault.address, VALIDATORS_META_PARAMS);
    },
    select: (data) => data.meta,
  });

  return { ...query, meta: query.data };
};
