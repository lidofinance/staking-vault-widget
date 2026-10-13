import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

export type CalculateHealthArgs = {
  totalValue: bigint;
  liabilitySharesInStethWei: bigint;
  forceRebalanceThresholdBP: number;
};

export const calculateHealth = (args: CalculateHealthArgs) => {
  const { totalValue, liabilitySharesInStethWei, forceRebalanceThresholdBP } =
    args;

  const PRECISION_BN = 10n ** 18n;
  const PRECISION_NUMBER = Number(PRECISION_BN);

  const reverseThresholdBP =
    VAULT_TOTAL_BASIS_POINTS_BN - BigInt(forceRebalanceThresholdBP);

  const adjustedValuation18 =
    (totalValue * reverseThresholdBP) / VAULT_TOTAL_BASIS_POINTS_BN;

  const healthRatio18 =
    liabilitySharesInStethWei > 0n
      ? (adjustedValuation18 * PRECISION_BN) / liabilitySharesInStethWei
      : Infinity;

  const healthRatio = (Number(healthRatio18) * 100) / PRECISION_NUMBER;

  // Convert to readable format
  const isHealthy = healthRatio >= 100;

  return {
    healthRatio,
    isHealthy,
  };
};
