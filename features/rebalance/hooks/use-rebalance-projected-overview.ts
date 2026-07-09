import { useWatch } from 'react-hook-form';

import { useVaultOverviewData } from 'modules/vaults';
import { formatPercent, calculateOverviewV2 } from 'utils';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';
import { bigIntClampZero } from 'utils/bigint-math';
import { useMemo } from 'react';

export const useRebalanceProjectedOverview = () => {
  const { data, isPending } = useVaultOverviewData();

  const [rebalanceAmount, supplyEth, isSupplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['rebalanceAmount', 'supplyEth', 'isSupplyEth']
  >({
    name: ['rebalanceAmount', 'supplyEth', 'isSupplyEth'],
  });

  return useMemo(() => {
    if (!data) {
      return { data: undefined, isPending, projected: null };
    }

    const amount = rebalanceAmount ?? 0n;
    const effectiveSupply = isSupplyEth ? supplyEth ?? 0n : 0n;

    if (amount === 0n && effectiveSupply === 0n) {
      return { data, isPending, projected: null };
    }

    const projectedTotalValue = bigIntClampZero(
      data.totalValueETH + effectiveSupply - amount,
    );
    const projectedLiabilityStETH = bigIntClampZero(
      data.vaultLiabilityStETH - amount,
    );

    const { totalMintingCapacitySteth: projectTotalMintingCapacityStETH } =
      data.totalMintingCapacityStethByDeltaValue(effectiveSupply - amount);

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
      totalMintingCapacityStethWei: projectTotalMintingCapacityStETH,
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
        mintableStETH: bigIntClampZero(
          projectTotalMintingCapacityStETH - projectedLiabilityStETH,
        ),
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
  }, [data, isPending, isSupplyEth, rebalanceAmount, supplyEth]);
};
