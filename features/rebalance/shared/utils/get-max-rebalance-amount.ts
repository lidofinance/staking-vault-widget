import { bigIntMin } from 'utils/bigint-math';
import { RebalanceMode } from './get-rebalance-mode';

type GetMaxRebalanceAmountArgs = {
  mode: RebalanceMode;
  availableBalance: bigint;
  vaultLiability: bigint;
  supplyEth: bigint;
};
/**
 * Maximum amount of stETH Liability that can be repaid within a single
 * rebalance transaction.
 */
export const getMaxRebalanceAmount = ({
  mode,
  availableBalance,
  vaultLiability,
  supplyEth,
}: GetMaxRebalanceAmountArgs): bigint => {
  if (mode === 'rebalance') {
    // ETH for the repayment comes from the idle vault availableBalance and/or ETH
    // supplied from the connected wallet, but it can never exceed the
    // outstanding liability.
    return bigIntMin(availableBalance + supplyEth, vaultLiability);
  }

  // if mode 'none' or 'force', max button is hidden or unused
  return 0n;
};
