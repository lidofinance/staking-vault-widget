import { bigIntClampZero, bigIntMin } from 'utils/bigint-math';

type GetReduceToCapacityAmountArgs = {
  totalMintingCapacityStethByDeltaValue: (deltaValue: bigint) => bigint;
  currentVaultLiabilitySteth: bigint;
  toSupplyVaultValueEth?: bigint;
  maximumRebalanceAmountEth: bigint;
};

type GetReduceToCapacityAmountResult = {
  reduceToCapacityAmount: bigint;
  hasExcessLiability: boolean;
};

/**
 * Amount of stETH Liability that has to be repaid to bring the Utilization ratio
 * (liability / minting capacity) back down to 100%.
 *
 * We calculate how much stETH liability by RR vault can support with current value (+value to be supplied in rebalance tx)
 * If there is excess liability, meaning vault has more liability then can be collateralize,
 * the difference will be able to rebalance vault down to 100% utilization
 * The value is capped by maximumRebalanceAmount which is based on actual vault ETH balance and total liability
 */
export const getReduceToCapacityAmount = ({
  totalMintingCapacityStethByDeltaValue,
  currentVaultLiabilitySteth,
  toSupplyVaultValueEth = 0n,
  maximumRebalanceAmountEth,
}: GetReduceToCapacityAmountArgs): GetReduceToCapacityAmountResult => {
  const currentTotalMintingCapacitySteth =
    totalMintingCapacityStethByDeltaValue(0n);
  const totalMintingCapacityStethWithSupply =
    totalMintingCapacityStethByDeltaValue(toSupplyVaultValueEth);

  const hasExcessLiability =
    currentVaultLiabilitySteth > currentTotalMintingCapacitySteth;

  const excessLiabilityStethWithSupply = bigIntClampZero(
    currentVaultLiabilitySteth - totalMintingCapacityStethWithSupply,
  );

  const reduceToCapacityAmount = bigIntMin(
    excessLiabilityStethWithSupply,
    maximumRebalanceAmountEth,
  );

  return {
    reduceToCapacityAmount,
    hasExcessLiability,
  };
};
