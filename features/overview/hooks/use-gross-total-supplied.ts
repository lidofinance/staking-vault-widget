import { useVaultValidatorsMeta } from 'modules/vaults';

import { useVaultOverview } from 'features/overview/vault-overview';

// Everything supplied to the vault, including the ETH the oracle has not put into Total Value yet:
// off-book deposits still in the beacon chain queue, and reported increases LazyOracle is holding
// back under quarantine. Shared so the dashboard metric and the Total Value modal cannot drift.
export const useGrossTotalSupplied = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const { meta, isLoading: isLoadingValidatorsMeta } = useVaultValidatorsMeta();

  const totalValue = values?.totalValueETH ?? 0n;
  const offBookBalance = meta?.offBookBalance ?? 0n;

  // Same definition the quarantine banner uses.
  const { pendingTotalValueIncrease = 0n, totalValueRemainder = 0n } =
    values?.vaultQuarantineState ?? {};
  const quarantined = pendingTotalValueIncrease + totalValueRemainder;

  return {
    grossTotalSupplied: totalValue + offBookBalance + quarantined,
    offBookBalance,
    quarantined,
    // whether anything is supplied but missing from Total Value, i.e. whether the gross figure
    // differs from Total Value at all
    hasExcess: offBookBalance > 0n || quarantined > 0n,
    isLoading: isLoadingVault || isLoadingValidatorsMeta,
  };
};
