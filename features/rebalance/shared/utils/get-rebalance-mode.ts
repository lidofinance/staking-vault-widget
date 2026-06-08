import { isBigint } from 'utils';

export type RebalanceMode = 'force' | 'rebalance' | 'none';

type GetRebalanceModeArgs = {
  vaultLiability: bigint;
  forceRebalanceThresholdWei: bigint | undefined;
};

/**
 * Determines which rebalance scenario the vault is currently in:
 *
 * - `none`: there is no outstanding stETH Liability, so nothing to rebalance.
 * - `force`: the Health factor dropped below 100% — the permissionless
 *   rebalancing mechanism is active and the whole health shortfall
 *   (`forceRebalanceThresholdWei`) must be covered via the hub.
 * - `rebalance`: the vault is still healthy but has a positive stETH Liability.
 *   The user may voluntarily repay any part of it (this also covers the case
 *   when the minting capacity is exceeded, totalMintingCapacity < vaultLiability).
 */
export const getRebalanceMode = ({
  vaultLiability,
  forceRebalanceThresholdWei,
}: GetRebalanceModeArgs): RebalanceMode => {
  if (vaultLiability === 0n) {
    return 'none';
  }

  if (isBigint(forceRebalanceThresholdWei) && forceRebalanceThresholdWei > 0n) {
    return 'force';
  }

  return 'rebalance';
};
