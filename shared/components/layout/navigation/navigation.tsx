import type { FC } from 'react';

import { NavigationContainer } from './components';
import { RootNavigation, VaultNavigation } from './modes';

type NavigationProps = {
  mode?: 'root' | 'create-vault' | 'vault';
};

export const Navigation: FC<NavigationProps> = ({ mode = 'root' }) => {
  // create-vault page shares the root navigation by design
  const NavigationContent = mode === 'vault' ? VaultNavigation : RootNavigation;

  return (
    <NavigationContainer>
      <NavigationContent />
    </NavigationContainer>
  );
};
