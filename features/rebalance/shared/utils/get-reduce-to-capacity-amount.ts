import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';
import { bigIntClampZero, bigIntMin } from 'utils/bigint-math';

type GetReduceToCapacityAmountArgs = {
  currentVaultLiabilitySteth: bigint;
  totalVaultValueEth: bigint;
  toSupplyVaultValueEth?: bigint;
  reserveRatioBP: bigint;
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
  currentVaultLiabilitySteth,
  reserveRatioBP,
  toSupplyVaultValueEth = 0n,
  totalVaultValueEth,
  maximumRebalanceAmountEth,
}: GetReduceToCapacityAmountArgs): GetReduceToCapacityAmountResult => {
  const targetVaultLiabilityStethNoSupply =
    (totalVaultValueEth * reserveRatioBP) / VAULT_TOTAL_BASIS_POINTS_BN;

  const targetVaultLiabilitySteth =
    ((totalVaultValueEth + toSupplyVaultValueEth) * reserveRatioBP) /
    VAULT_TOTAL_BASIS_POINTS_BN;

  const excessLiabilitySteth = bigIntClampZero(
    currentVaultLiabilitySteth - targetVaultLiabilitySteth,
  );

  const hasExcessLiability =
    currentVaultLiabilitySteth - targetVaultLiabilityStethNoSupply > 0n;

  return {
    reduceToCapacityAmount: bigIntMin(
      excessLiabilitySteth,
      maximumRebalanceAmountEth,
    ),
    hasExcessLiability,
  };
};
