import { VAULT_TOTAL_BASIS_POINTS } from 'consts/vault-hub';
import { VaultSocket } from 'types';

export const getHealthScore = (
  valuation: bigint,
  vaultHubSocket: VaultSocket,
): number => {
  const { sharesMinted, reserveRatioThresholdBP } = vaultHubSocket;
  if (sharesMinted === 0n) {
    return Infinity;
  }

  return Number(
    (valuation * BigInt(VAULT_TOTAL_BASIS_POINTS - reserveRatioThresholdBP)) /
      sharesMinted,
  );
};
