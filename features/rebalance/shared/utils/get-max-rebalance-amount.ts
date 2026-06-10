import { bigIntMin } from 'utils/bigint-math';

type GetMaxRebalanceAmountArgs = {
  availableBalance: bigint;
  vaultLiability: bigint;
  supplyEth: bigint;
};
/**
 * Maximum amount of ETH that can be used to rebalance vault liability
 * in a rebalance transaction.
 */
export const getMaxRebalanceAmount = ({
  availableBalance,
  vaultLiability,
  supplyEth,
}: GetMaxRebalanceAmountArgs): bigint => {
  return bigIntMin(availableBalance + supplyEth, vaultLiability);
};
