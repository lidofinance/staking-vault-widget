import { Address } from 'viem';
import { VaultTable } from 'features/home/vault-table';
import { AddVault } from 'features/home/my-vaults/add-vault';

import { useVaultsDataByOwner } from 'modules/web3/hooks/use-vaults-data-by-owner';

export const ConnectedWalletContent = ({ address }: { address: Address }) => {
  const { vaults } = useVaultsDataByOwner(address);

  return (
    <>
      <VaultTable title="My Vaults" vaults={vaults} showTitle />
      <AddVault />
    </>
  );
};
