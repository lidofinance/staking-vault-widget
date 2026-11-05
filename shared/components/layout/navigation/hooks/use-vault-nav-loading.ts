import { useVault } from 'modules/vaults';

// vault data is absent while the first fetch (or a retry after error) is in flight;
// also covers the query key change after a tx, when data is reset to undefined
export const useVaultNavLoading = () => {
  const { vaultAddress, activeVault, error, isFetching } = useVault();

  return !!vaultAddress && !activeVault && (!error || isFetching);
};
