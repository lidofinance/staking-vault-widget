import type { FC } from 'react';

import { useVault } from 'modules/vaults';
import { AddressBadge } from 'shared/components/address-badge';

import { AllVaultsDesktop, VaultNavigationList } from '../components';
import { VaultError } from '../vault-error';

import { SelectedVaultWrapper } from '../styles';

export const VaultNavigation: FC = () => {
  const { vaultAddress } = useVault();

  return (
    <>
      <AllVaultsDesktop />
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
