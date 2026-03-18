import type { FC } from 'react';

import {
  AllVaultsDesktop,
  VaultNavigationList,
  CurrentVault,
} from '../components';
import { VaultError } from '../vault-error';

export const VaultNavigation: FC = () => {
  return (
    <>
      <AllVaultsDesktop />
      <CurrentVault />
      <VaultNavigationList />
      <VaultError />
    </>
  );
};
