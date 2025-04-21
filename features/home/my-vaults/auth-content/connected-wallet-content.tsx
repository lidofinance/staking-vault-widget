import { VaultTable } from 'features/home/vault-table';
import { AddVault } from 'features/home/my-vaults/add-vault';

import { useVaultsDataByOwner } from 'modules/vaults/hooks/use-vaults-data-by-owner';

export const ConnectedWalletContent = () => {
  const { vaults } = useVaultsDataByOwner();

  return (
    <>
      <VaultTable title="My Vaults" vaults={vaults} showTitle />
      <AddVault />
    </>
  );
};
