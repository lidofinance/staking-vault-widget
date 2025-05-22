import { VaultTable } from 'features/home/components/vault-table';
import { useConnectedVaultsList } from './use-connected-vaults-list';

export const AllVaults = () => {
  const {
    vaults,
    isLoading,
    page,
    pagesCount,
    setPage,
    refetch,
    isError,
    totalVaultsCount,
  } = useConnectedVaultsList();

  return (
    <VaultTable
      title="All Vaults"
      vaults={vaults}
      vaultsCount={totalVaultsCount}
      isError={isError}
      isLoading={isLoading}
      refetch={refetch}
      page={page}
      pagesCount={pagesCount}
      setPage={setPage}
    />
  );
};
