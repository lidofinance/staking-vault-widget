import { VaultTable } from 'features/home/vault-table';
import { useConnectedVaultsList } from './use-connected-vaults-list';

export const AllVaults = () => {
  const {
    vaults,
    isLoading,
    page,
    pagesCount,
    setPage,
    setSort,
    sortBy,
    sortDir,
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
      sortDir={sortDir}
      sortBy={sortBy}
      setSort={setSort}
      dataTestId="allVaultsTable"
    />
  );
};
