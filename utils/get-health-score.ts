import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults/consts';
import { VaultSocket } from 'types';

export const getHealthScore = (
  valuation: bigint,
  vaultHubSocket: VaultSocket,
): number => {
  const { sharesMinted, rebalanceThresholdBP } = vaultHubSocket;
  if (sharesMinted === 0n) {
    return Infinity;
  }

  const healthScore = Number(
    (valuation * (VAULT_TOTAL_BASIS_POINTS_BN - BigInt(rebalanceThresholdBP))) /
      sharesMinted,
  );

  if (healthScore > 100000) {
    return Infinity;
  }

  return healthScore;
};
