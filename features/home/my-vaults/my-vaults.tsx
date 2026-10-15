import { VaultTable } from 'features/home/vault-table';
import { useDappStatus } from 'modules/web3';

import { AddVault } from './add-vault';
import { MyVaultsPromo } from './my-vaults-promo';
import { useMyVaultsList } from './use-my-vaults-list';
import { MobileOnly } from './styles';

export const MyVaults = () => {
  const { isWalletConnected } = useDappStatus();
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

  const content = (
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

  if (isWalletConnected) return content;

  // Promo is shown on desktop only, mobile keeps the title with the connect placeholder
  return (
    <>
      <MyVaultsPromo />
      <MobileOnly>{content}</MobileOnly>
    </>
  );
};
