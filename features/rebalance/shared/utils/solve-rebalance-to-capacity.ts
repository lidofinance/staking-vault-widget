import { bigIntClampZero } from 'utils/bigint-math';
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
  if (lockableValueEth - currentLiabilitySteth <= minimalReserve)
    return currentLiabilitySteth;
  // can be negative if the supply is too high and covers rebalance so we clamp to 0
  if (lockableValueEth - currentLiabilitySteth)
    return bigIntClampZero(
      lockableValueEth -
        ((lockableValueEth - currentLiabilitySteth) *
          VAULT_TOTAL_BASIS_POINTS_BN) /
          reserveRatioBP,
    );

  return 0n;
};
