import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { useVaultOverviewData } from 'modules/vaults';

import { getMaxRebalanceAmount } from 'features/rebalance/shared';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { useRebalanceMode } from './use-rebalance-mode';

export const useMaxRebalanceAmount = () => {
  const { data } = useVaultOverviewData();
  const mode = useRebalanceMode();
  const { rebalanceETH, balance, vaultLiability } = data ?? {};

  const [supplyEth, isSupplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['supplyEth', 'isSupplyEth']
  >({ name: ['supplyEth', 'isSupplyEth'] });

  // The "Max" helper mirrors the validation cap: for a voluntary rebalance the
  // repayment is bounded by the idle vault balance plus supplied ETH and by the
  // outstanding liability.
  return useMemo(
    () =>
      getMaxRebalanceAmount({
        mode,
        rebalanceETH: rebalanceETH ?? 0n,
        balance: balance ?? 0n,
        vaultLiability: vaultLiability ?? 0n,
        supplyEth: isSupplyEth ? supplyEth ?? 0n : 0n,
      }),
    [mode, rebalanceETH, balance, vaultLiability, isSupplyEth, supplyEth],
  );
};
