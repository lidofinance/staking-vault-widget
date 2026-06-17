import { bigIntMax, bigIntMin } from 'utils/bigint-math';
import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

type SolveParams = {
  currentLiabilitySteth: bigint;
  lockableValueEth: bigint;
  reserveRatioBP: bigint;
  minimalReserve: bigint;
};

/**
 * Solves the non-linear equation for the rebalance amount that will bring the vault back to 100% utilization
 * Returns the single best positive solution: prefers an exact root,
 * falls back to the clamped boundary value.
 */
export const solveRebalanceToCapacity = ({
  currentLiabilitySteth,
  lockableValueEth,
  reserveRatioBP,
  minimalReserve,
}: SolveParams): bigint => {
  if (!(reserveRatioBP > 0n && reserveRatioBP < VAULT_TOTAL_BASIS_POINTS_BN))
    throw new Error('reserveRatioBP range');
  if (!(minimalReserve > 0n)) throw new Error('minimalReserve > 0');
  if (!(lockableValueEth > 0n)) throw new Error('lockableValueEth > 0');

  const upper = bigIntMin(currentLiabilitySteth, lockableValueEth);
  const clamp = (x: bigint): bigint => bigIntMin(bigIntMax(x, 0n), upper);

  const D = lockableValueEth - currentLiabilitySteth; // deficit

  // Deficit non-positive, or below the fixed reserve floor -> fn floors to 0 -> x = l.
  // Clamped: collapses to `upper`.
  if (D <= 0n || D < minimalReserve) {
    return clamp(currentLiabilitySteth); // == upper here, but explicit for clarity
  }

  // Percent arm binds: (v - x)*reserveRatioBP/TOTAL_BP = D
  //   x = v - D*TOTAL_BP/reserveRatioBP
  const x =
    lockableValueEth - (D * VAULT_TOTAL_BASIS_POINTS_BN) / reserveRatioBP;
  return clamp(x);
};
