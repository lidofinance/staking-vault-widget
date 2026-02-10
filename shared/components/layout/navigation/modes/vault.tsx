import { useVault } from 'modules/vaults';
import { AddressBadge } from 'shared/components/address-badge';

import { BackAllVaults, VaultNavigationList } from '../components';
import { VaultError } from '../vault-error';

import { SelectedVaultWrapper } from '../styles';

export const VaultNavigation = () => {
  const { vaultAddress } = useVault();

  return (
    <>
      <BackAllVaults />
      <SelectedVaultWrapper>
        <AddressBadge
          bgColor="transparent"
          address={vaultAddress}
          symbols={5}
        />
      </SelectedVaultWrapper>
      <VaultNavigationList />
      <VaultError />
    </>
  );
};
