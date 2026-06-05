import { useMemo } from 'react';

import { useVaultOverviewData } from 'modules/vaults';

import { getReduceToCapacityAmount } from 'features/rebalance/shared';

import { useMaxRebalanceAmount } from './use-max-rebalance-amount';

/**
 * Repayment amount required to bring the Utilization ratio back to 100% when the
 * stETH minting capacity is exceeded. Mirrors the validation cap so the value is
 * always within the rebalanceable range.
 */
export const useReduceToCapacityAmount = () => {
  const { data } = useVaultOverviewData();
  const maxAmount = useMaxRebalanceAmount();
  const { vaultLiability, totalMintingCapacity } = data ?? {};

  return useMemo(
    () =>
      getReduceToCapacityAmount({
        vaultLiability: vaultLiability ?? 0n,
        totalMintingCapacity: totalMintingCapacity ?? 0n,
        maxAmount,
      }),
    [vaultLiability, totalMintingCapacity, maxAmount],
  );
};
