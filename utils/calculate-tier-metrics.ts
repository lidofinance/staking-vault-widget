import { Tier, TierVault } from 'modules/vaults';
import { bigIntMin } from 'utils/bigint-math';
import { formatPercent, toStethValue } from 'utils';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
} from 'modules/vaults';

type CalculatedMetricsArgs = {
  newTier?: Tier | null;
  vault: TierVault;
  newVaultMintingLimit: bigint | undefined;
};

type CalculatedMetrics = {
  newMintingCapacityValue?: string;
  newUtilizationValue?: string;
  forcedRebalanceThresholdBPValue?: string;
  reserveRatioBPValue?: string;
  infraFeeBPValue?: string;
  liquidityFeeBPValue?: string;
  reservationFeeBPValue?: string;
};

export const calculateTierMetrics = ({
  newTier,
  vault,
  newVaultMintingLimit = 0n,
}: CalculatedMetricsArgs): CalculatedMetrics => {
  if (!newTier)
    return {
      newMintingCapacityValue: undefined,
      newUtilizationValue: undefined,
    };

  const newTotalMintingCapacityBigInt = bigIntMin(
    newVaultMintingLimit,
    vault.totalMintingCapacityStETH,
  );
  const newMintingCapacityValue = toStethValue(newTotalMintingCapacityBigInt);

  const newUtilizationValue = formatPercent.format(
    newTotalMintingCapacityBigInt === 0n
      ? 0
      : Number(
          ((vault.liabilityStETH ?? 0n) * VAULT_TOTAL_BASIS_POINTS_BN) /
            newTotalMintingCapacityBigInt,
        ) / VAULT_TOTAL_BASIS_POINTS,
  );

  const forcedRebalanceThresholdBPValue = formatPercent.format(
    newTier.forcedRebalanceThresholdBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const reserveRatioBPValue = formatPercent.format(
    newTier.reserveRatioBP / VAULT_TOTAL_BASIS_POINTS,
  );

  const infraFeeBPValue = formatPercent.format(
    newTier.infraFeeBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const liquidityFeeBPValue = formatPercent.format(
    newTier.liquidityFeeBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const reservationFeeBPValue = formatPercent.format(
    newTier.reservationFeeBP / VAULT_TOTAL_BASIS_POINTS,
  );

  return {
    newMintingCapacityValue,
    newUtilizationValue,
    forcedRebalanceThresholdBPValue,
    reserveRatioBPValue,
    infraFeeBPValue,
    liquidityFeeBPValue,
    reservationFeeBPValue,
  };
};
