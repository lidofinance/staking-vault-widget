import type { FC } from 'react';

import { NavigationContainer } from './components';
import { RootNavigation, VaultNavigation } from './modes';

type NavigationProps = {
  mode?: 'root' | 'vault';
};

export const Navigation: FC<NavigationProps> = ({ mode = 'root' }) => {
  const NavigationContent = mode === 'vault' ? VaultNavigation : RootNavigation;

  return (
    <NavigationContainer>
      <NavigationContent />
    </NavigationContainer>
  );
};
