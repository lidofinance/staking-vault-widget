import { VAULT_TOTAL_BASIS_POINTS } from 'consts/vault-hub';
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
    (valuation * BigInt(VAULT_TOTAL_BASIS_POINTS - rebalanceThresholdBP)) /
      sharesMinted,
  );

  if (healthScore > 100000) {
    return Infinity;
  }

  return healthScore;
};
