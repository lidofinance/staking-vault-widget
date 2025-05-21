import { VaultTable } from 'features/home/components/vault-table';
import { AddVault } from './add-vault';

import { useMyVaultsList } from './use-my-vaults-list';

export const MyVaultsTable = () => {
  const {
    vaults,
    isLoading,
    totalVaultsCount,
    refetch,
    page,
    setPage,
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
      />
      <AddVault />
    </>
  );
};
