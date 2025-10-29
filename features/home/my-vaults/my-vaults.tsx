import { VaultTable } from 'features/home/vault-table';

import { AddVault } from './add-vault';
import { useMyVaultsList } from './use-my-vaults-list';

export const MyVaults = () => {
  const {
    vaults,
    isLoading,
    totalVaultsCount,
    nextUpdateAt,
    refetch,
    page,
    setPage,
    setSort,
    sortBy,
    sortDir,
    pagesCount,
    isError,
  } = useMyVaultsList();

  return (
    <>
      <VaultTable
        title="My Vaults"
        emptyDisplay="hideTable"
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
        nextUpdateAt={nextUpdateAt}
        dataTestId="myVaultsTable"
      />
      <AddVault />
    </>
  );
};
