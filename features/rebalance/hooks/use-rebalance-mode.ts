import { useMemo } from 'react';

import { useVaultOverviewData } from 'modules/vaults';

import { getRebalanceMode } from 'features/rebalance/shared';

export const useRebalanceMode = () => {
  const { data } = useVaultOverviewData();
  const { vaultLiability, healthFactorNumber } = data ?? {};

  return useMemo(
    () =>
      getRebalanceMode({
        vaultLiability: vaultLiability ?? 0n,
        healthFactorNumber,
      }),
    [vaultLiability, healthFactorNumber],
  );
};
