import { useVaultOverviewData } from 'modules/vaults';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import type { RebalanceFormFieldValues } from '../types';

import {
  getMaxRebalanceAmount,
  getRebalanceMode,
  getReduceToCapacityAmount,
} from '../shared';

export const useRebalanceState = () => {
  const [supplyEth, isSupplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['supplyEth', 'isSupplyEth']
  >({ name: ['supplyEth', 'isSupplyEth'] });

  const { data } = useVaultOverviewData();

  return useMemo(() => {
    if (!data)
      return {
        isForceRebalance: false,
        rebalanceMode: 'voluntary' as const,
      };

    const {
      vaultLiabilityStETH,
      valueToForceRebalance,
      availableBalanceWei,
      totalValueETH,
      reserveRatioBP,
    } = data;

    const supplyEthValue = isSupplyEth ? supplyEth ?? 0n : 0n;

    const maxRebalanceAmount = getMaxRebalanceAmount({
      availableBalance: availableBalanceWei,
      vaultLiability: vaultLiabilityStETH,
      supplyEth: supplyEthValue,
    });

    const { reduceToCapacityAmount, hasExcessLiability } =
      getReduceToCapacityAmount({
        currentVaultLiabilitySteth: vaultLiabilityStETH,
        totalVaultValueEth: totalValueETH,
        toSupplyVaultValueEth: supplyEthValue,
        reserveRatioBP: BigInt(reserveRatioBP),
        maximumRebalanceAmountEth: maxRebalanceAmount,
      });

    const rebalanceMode = getRebalanceMode({
      vaultLiability: vaultLiabilityStETH,
      valueToForceRebalance,
      hasExcessLiability,
    });

    return {
      rebalanceMode,
      isForceRebalance: rebalanceMode === 'force',
      valueToForceRebalance,
      maxRebalanceAmount,
      reduceToCapacityAmount,
      hasExcessLiability,
    };
  }, [data, isSupplyEth, supplyEth]);
};
