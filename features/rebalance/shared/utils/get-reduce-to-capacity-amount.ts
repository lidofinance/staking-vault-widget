import { type TotalMintingCapacityByDeltaValueFn } from 'modules/vaults';
import { bigIntMin } from 'utils/bigint-math';
import { solveRebalanceToCapacity } from './solve-rebalance-to-capacity';

type GetReduceToCapacityAmountArgs = {
  totalMintingCapacityStethByDeltaValue: TotalMintingCapacityByDeltaValueFn;
  currentVaultLiabilitySteth: bigint;
  toSupplyVaultValueEth?: bigint;
  maximumRebalanceAmountEth: bigint;
  reserveRatioBP: bigint;
  minimalReserveEth: bigint;
};

type GetReduceToCapacityAmountResult = {
  reduceToCapacityAmount: bigint;
  hasExcessLiability: boolean;
  canReduceToCapacity: boolean;
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
  reserveRatioBP,
  minimalReserveEth,
}: GetReduceToCapacityAmountArgs): GetReduceToCapacityAmountResult => {
  const { totalMintingCapacitySteth: currentTotalMintingCapacitySteth } =
    totalMintingCapacityStethByDeltaValue(0n);
  const { totalLockableValueEth } = totalMintingCapacityStethByDeltaValue(
    toSupplyVaultValueEth,
  );

  const hasExcessLiability =
    currentVaultLiabilitySteth > currentTotalMintingCapacitySteth;

  const excessLiabilityStethWithSupply = solveRebalanceToCapacity({
    currentLiabilitySteth: currentVaultLiabilitySteth,
    lockableValueEth: totalLockableValueEth,
    reserveRatioBP,
    minimalReserve: minimalReserveEth,
  });

  const reduceToCapacityAmount = bigIntMin(
    excessLiabilityStethWithSupply,
    maximumRebalanceAmountEth,
  );

  const canReduceToCapacity =
    excessLiabilityStethWithSupply == reduceToCapacityAmount;

  return {
    reduceToCapacityAmount,
    hasExcessLiability,
    canReduceToCapacity,
  };
};
