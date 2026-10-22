import { useAccount } from 'wagmi';

import { VaultTable } from 'features/home/vault-table';

import { AddVault } from './add-vault';
import { MyVaultsPromo } from './my-vaults-promo';
import { useMyVaultsList } from './use-my-vaults-list';
import { useWalletRestoring } from './use-wallet-restoring';
import { MobileOnly } from './styles';

export const MyVaults = () => {
  // status instead of isConnected: the latter is false while reconnecting,
  // which would flash the promo for users with a remembered wallet
  const { status } = useAccount();
  // and before the reconnect starts it's still 'disconnected'
  const isWalletRestoring = useWalletRestoring();
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

  if (status !== 'disconnected') return content;

  return (
    <>
      {!isWalletRestoring && <MyVaultsPromo />}
      <MobileOnly>{content}</MobileOnly>
    </>
  );
};
