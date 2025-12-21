import { Tier, TierVault } from 'modules/vaults';
import { bigIntMin } from 'utils/bigint-math';
import { formatPercent, formatBasisPoint } from 'utils';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
} from 'modules/vaults';

type CalculatedMetricsArgs = {
  tier?: Tier | null;
  vault: TierVault;
  newVaultMintingLimit: bigint | undefined;
};

type MetricComparison<T> = {
  oldValue: T;
  newValue: T;
  isChanged: boolean;
};

type CalculatedMetrics = {
  totalMintingCapacity: MetricComparison<bigint>;
  utilization: MetricComparison<string>;
  forcedRebalanceThresholdBP: MetricComparison<string>;
  reserveRatioBP: MetricComparison<string>;
  infraFeeBP: MetricComparison<string>;
  liquidityFeeBP: MetricComparison<string>;
  reservationFeeBP: MetricComparison<string>;
};

const compareAndFormat = (
  vaultValue: number,
  tierValue: number,
): MetricComparison<string> => {
  const oldValue = formatBasisPoint(vaultValue);
  const newValue = formatBasisPoint(tierValue);
  return {
    oldValue,
    newValue,
    isChanged: vaultValue !== tierValue,
  };
};

const calculateUtilization = (
  liabilityStETH: bigint,
  totalMintingCapacityStETH: bigint,
): number => {
  if (totalMintingCapacityStETH === 0n) return 0;

  return (
    Number(
      (liabilityStETH * VAULT_TOTAL_BASIS_POINTS_BN) /
        totalMintingCapacityStETH,
    ) / VAULT_TOTAL_BASIS_POINTS
  );
};

export const calculateTierMetrics = ({
  tier,
  vault,
  newVaultMintingLimit = 0n,
}: CalculatedMetricsArgs): CalculatedMetrics | undefined => {
  if (!tier) return undefined;

  const newTotalMintingCapacityBigInt = bigIntMin(
    newVaultMintingLimit ?? 0n,
    vault.totalMintingCapacityStETH,
  );

  const oldUtilization = calculateUtilization(
    vault.liabilityStETH,
    vault.totalMintingCapacityStETH,
  );
  const newUtilization = calculateUtilization(
    vault.liabilityStETH,
    newTotalMintingCapacityBigInt,
  );

  return {
    totalMintingCapacity: {
      oldValue: vault.totalMintingCapacityStETH,
      newValue: newTotalMintingCapacityBigInt,
      isChanged:
        vault.totalMintingCapacityStETH !== newTotalMintingCapacityBigInt,
    },
    utilization: {
      oldValue: formatPercent.format(oldUtilization),
      newValue: formatPercent.format(newUtilization),
      isChanged: oldUtilization !== newUtilization,
    },
    forcedRebalanceThresholdBP: compareAndFormat(
      vault.forcedRebalanceThresholdBP,
      tier.forcedRebalanceThresholdBP,
    ),
    reserveRatioBP: compareAndFormat(vault.reserveRatioBP, tier.reserveRatioBP),
    infraFeeBP: compareAndFormat(vault.infraFeeBP, tier.infraFeeBP),
    liquidityFeeBP: compareAndFormat(vault.liquidityFeeBP, tier.liquidityFeeBP),
    reservationFeeBP: compareAndFormat(
      vault.reservationFeeBP,
      tier.reservationFeeBP,
    ),
  };
};
