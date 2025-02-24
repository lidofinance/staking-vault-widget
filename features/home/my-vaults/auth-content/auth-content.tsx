import { Address } from 'viem';
import { VaultTable } from 'features/home/vault-table';
import { AddVault } from 'features/home/my-vaults/add-vault';

import { useVaultsByOwner } from 'modules/web3/hooks/use-vaults-by-owner';
import { useVaultData } from 'shared/hooks/use-vault-data';

export const AuthContent = ({ address }: { address: Address }) => {
  const { data: ownerVaults } = useVaultsByOwner(address);
  const { vaultsData } = useVaultData(ownerVaults);

  return (
    <>
      <VaultTable title="My Vaults" vaults={vaultsData?.vaults} showTitle />
      <AddVault />
    </>
  );
};
