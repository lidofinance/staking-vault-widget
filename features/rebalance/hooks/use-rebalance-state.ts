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
        rebalanceMode: 'none' as const,
      };

    const {
      vaultLiabilityStETH,
      valueToForceRebalance,
      availableBalanceWei,
      utilizationRatioNumber,
      totalMintingCapacityStethByDeltaValue,
    } = data;

    const supplyEthValue = isSupplyEth ? supplyEth ?? 0n : 0n;

    const maxRebalanceAmount = getMaxRebalanceAmount({
      availableBalance: availableBalanceWei,
      vaultLiability: vaultLiabilityStETH,
      supplyEth: supplyEthValue,
    });

    const {
      reduceToCapacityAmount,
      hasExcessLiability,
      canReduceToCapacity,
      canRecommend,
    } = getReduceToCapacityAmount({
      totalMintingCapacityStethByDeltaValue,
      currentVaultLiabilitySteth: vaultLiabilityStETH,
      toSupplyVaultValueEth: supplyEthValue,
      maximumRebalanceAmountEth: maxRebalanceAmount,
      reserveRatioBP: BigInt(data.reserveRatioBP),
      minimalReserveEth: data.minimalReserve,
    });

    const rebalanceMode = getRebalanceMode({
      vaultLiability: vaultLiabilityStETH,
      valueToForceRebalance,
      utilizationRatioNumber,
    });

    return {
      rebalanceMode,
      isForceRebalance: rebalanceMode === 'force',
      isHealing: rebalanceMode === 'healing',
      valueToForceRebalance,
      maxRebalanceAmount,
      reduceToCapacityAmount,
      hasExcessLiability,
      canReduceToCapacity,
      canRecommend,
      isSupplyEth,
    };
  }, [data, isSupplyEth, supplyEth]);
};
