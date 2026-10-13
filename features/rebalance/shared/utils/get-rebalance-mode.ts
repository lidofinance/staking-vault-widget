import { isBigint } from 'utils';
import { UTILIZATION_RATIO_THRESHOLD } from 'consts/threshold';

export type RebalanceMode = 'none' | 'rebalance' | 'healing' | 'force';

type GetRebalanceModeArgs = {
  vaultLiability: bigint;
  valueToForceRebalance: bigint;
  utilizationRatioNumber: number;
};

/**
 * Determines which rebalance scenario the vault is currently in:
 *
 * - `none`: there is no outstanding stETH Liability, so nothing to rebalance.
 * - `rebalance`: the vault is still healthy but has a positive stETH Liability.
 *   The user may voluntarily rebalance any part of it
 * - `healing`: the vault is undercollateralized but not above force rebalance threshold.
 *    The user may rebalance any part of the shortfall or even more.
 * - `force`: the Health factor dropped below 100% — the permissionless
 *   rebalancing mechanism is active and the whole health shortfall
 *   (`valueToForceRebalance`) must be covered via the hub.
 */
export const getRebalanceMode = ({
  vaultLiability,
  valueToForceRebalance,
  utilizationRatioNumber,
}: GetRebalanceModeArgs): RebalanceMode => {
  switch (true) {
    case vaultLiability === 0n:
      return 'none';
    case isBigint(valueToForceRebalance) && valueToForceRebalance > 0n:
      return 'force';
    case UTILIZATION_RATIO_THRESHOLD < utilizationRatioNumber:
      return 'healing';
    default:
      return 'rebalance';
  }
};
