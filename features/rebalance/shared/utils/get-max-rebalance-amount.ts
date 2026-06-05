import { bigIntMin } from 'utils/bigint-math';
import { RebalanceMode } from './get-rebalance-mode';

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

  if (mode === 'rebalance') {
    // ETH for the repayment comes from the idle vault balance and/or ETH
    // supplied from the connected wallet, but it can never exceed the
    // outstanding liability.
    return bigIntMin(balance + supplyEth, vaultLiability);
  }

  return 0n;
};
