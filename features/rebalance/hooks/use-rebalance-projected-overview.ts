import { useWatch } from 'react-hook-form';

import { useVaultOverviewData } from 'modules/vaults';
import { formatPercent, calculateOverviewV2 } from 'utils';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

export const useRebalanceProjectedOverview = () => {
  const { data, isPending } = useVaultOverviewData();

  const [rebalanceAmount, supplyEth, isSupplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['rebalanceAmount', 'supplyEth', 'isSupplyEth']
  >({
    name: ['rebalanceAmount', 'supplyEth', 'isSupplyEth'],
  });

  if (!data) {
    return { data: undefined, isPending, projected: null };
  }

  const amount = rebalanceAmount ?? 0n;
  const effectiveSupply = isSupplyEth ? supplyEth ?? 0n : 0n;

  if (amount === 0n && effectiveSupply === 0n) {
    return { data, isPending, projected: null };
  }

  const rawProjectedTotal = data.totalValueETH + effectiveSupply;
  const projectedTotalValue =
    rawProjectedTotal >= amount ? rawProjectedTotal - amount : 0n;
  const projectedLiabilityStETH =
    data.vaultLiabilityStETH >= amount ? data.vaultLiabilityStETH - amount : 0n;

  const projectedOverview = calculateOverviewV2({
    totalValue: projectedTotalValue,
    reserveRatioBP: data.reserveRatioBP,
    liabilitySharesInStethWei: projectedLiabilityStETH,
    currentLiabilityStETH: data.vaultData.currentLiabilityStETH,
    forceRebalanceThresholdBP: data.forcedRebalanceThresholdBP,
    withdrawableEther: data.withdrawableEther,
    balance: data.balance,
    locked: data.collateral,
    nodeOperatorDisbursableFee: data.undisbursedNodeOperatorFee,
    totalMintingCapacityStethWei: data.totalMintingCapacityStETH,
    unsettledLidoFees: data.unsettledLidoFees,
    feeObligation: data.feeObligation,
    currentMaxLiabilityStETH: data.vaultData.currentMaxLiabilityStETH,
  });

  return {
    data,
    isPending,
    projected: {
      totalValue: projectedTotalValue,
      vaultLiability: projectedLiabilityStETH,
      healthFactor: formatPercent.format(projectedOverview.healthRatio / 100),
      healthFactorNumber:
        projectedOverview.healthRatio > 100000
          ? Infinity
          : projectedOverview.healthRatio,
      utilizationRatio: formatPercent.format(
        projectedOverview.utilizationRatio / 100,
      ),
      utilizationRatioNumber: projectedOverview.utilizationRatio,
    },
  };
};
