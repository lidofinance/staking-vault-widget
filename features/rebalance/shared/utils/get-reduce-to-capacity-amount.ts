import { bigIntMin } from 'utils/bigint-math';

type GetReduceToCapacityAmountArgs = {
  vaultLiability: bigint;
  totalMintingCapacity: bigint;
  maxAmount: bigint;
};

/**
 * Amount of stETH Liability that has to be repaid to bring the Utilization ratio
 * (liability / minting capacity) back down to 100%.
 *
 * When the minting capacity is exceeded the liability is larger than the
 * capacity, so the surplus `liability - capacity` is what needs to be rebalanced
 * away. The result is capped by the maximum amount that can actually be
 * rebalanced (idle balance + supplied ETH, bounded by the liability).
 */
export const getReduceToCapacityAmount = ({
  vaultLiability,
  totalMintingCapacity,
  maxAmount,
}: GetReduceToCapacityAmountArgs): bigint => {
  const surplus =
    vaultLiability > totalMintingCapacity
      ? vaultLiability - totalMintingCapacity
      : 0n;

  return bigIntMin(surplus, maxAmount);
};
