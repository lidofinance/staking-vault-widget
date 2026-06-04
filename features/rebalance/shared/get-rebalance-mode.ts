import { isNumber } from 'utils';
import { bigIntMin } from 'utils/bigint-math';
import { UTILIZATION_RATIO_THRESHOLD } from 'consts/threshold';

export type RebalanceMode = 'force' | 'capacity-exceeded' | 'none';

type GetRebalanceModeArgs = {
  healthFactorNumber: number | undefined;
  utilizationRatioNumber: number | undefined;
};

/**
 * Determines which rebalance scenario the vault is currently in:
 *
 * - `force`: the Health factor dropped below 100% — the permissionless
 *   rebalancing mechanism is active and the whole health shortfall
 *   (`rebalanceETH`) must be covered via the hub.
 * - `capacity-exceeded`: the stETH Liability outgrew the minting capacity
 *   (`totalMintingCapacity < vaultLiability`, i.e. utilization ratio > 100%)
 *   while the vault is still healthy. The user has to cover the excess debt
 *   to restore the collateralization balance.
 * - `none`: nothing has to be rebalanced.
 */
export const getRebalanceMode = ({
  healthFactorNumber,
  utilizationRatioNumber,
}: GetRebalanceModeArgs): RebalanceMode => {
  if (isNumber(healthFactorNumber) && healthFactorNumber < 100) {
    return 'force';
  }

  if (
    isNumber(utilizationRatioNumber) &&
    utilizationRatioNumber >= UTILIZATION_RATIO_THRESHOLD
  ) {
    return 'capacity-exceeded';
  }

  return 'none';
};

type GetMaxRebalanceAmountArgs = {
  mode: RebalanceMode;
  rebalanceETH: bigint;
  balance: bigint;
  vaultLiability: bigint;
  supplyEth: bigint;
};

/**
 * Maximum amount of stETH Liability that can be repaid within a single
 * rebalance transaction.
 */
export const getMaxRebalanceAmount = ({
  mode,
  rebalanceETH,
  balance,
  vaultLiability,
  supplyEth,
}: GetMaxRebalanceAmountArgs): bigint => {
  if (mode === 'force') {
    // The shortfall reported by the hub is fixed; supplied ETH may extend it.
    return rebalanceETH + supplyEth;
  }

  if (mode === 'capacity-exceeded') {
    // ETH for the repayment comes from the idle vault balance and/or supplied
    // ETH, but it can never exceed the outstanding liability.
    return bigIntMin(balance + supplyEth, vaultLiability);
  }

  return 0n;
};
