import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults/consts';
import { VaultSocket } from 'types';

export const getHealthScore = (
  valuation: bigint,
  vaultHubSocket: VaultSocket,
): number => {
  const { liabilityShares, forcedRebalanceThresholdBP } = vaultHubSocket;
  if (liabilityShares === 0n) {
    return Infinity;
  }

  const healthScore = Number(
    (valuation *
      (VAULT_TOTAL_BASIS_POINTS_BN - BigInt(forcedRebalanceThresholdBP))) /
      liabilityShares,
  );

  if (healthScore > 100000) {
    return Infinity;
  }

  return healthScore;
};
