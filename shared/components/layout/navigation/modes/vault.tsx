import type { FC } from 'react';

import {
  CurrentVault,
  DocsLinks,
  HomeNavigationList,
  NavSection,
  VaultNavigationList,
} from '../components';
import { VaultError } from '../vault-error';

export const VaultNavigation: FC = () => {
  return (
    <>
      <CurrentVault />
      <VaultNavigationList />
      <NavSection>
        <HomeNavigationList />
      </NavSection>
      <NavSection>
        <DocsLinks />
      </NavSection>
      <VaultError />
    </>
  );
};
