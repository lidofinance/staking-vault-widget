import { type FC, useMemo } from 'react';
import { External } from '@lidofinance/lido-ui';

import { FEEDBACK_SURVEY_URL } from 'consts/external-links';

import { NavigationContainer } from './components';
import {
  RootNavigation,
  VaultNavigation,
  CreateVaultNavigation,
} from './modes';

import { FeedbackLink } from './styles';

type NavigationProps = {
  mode?: 'root' | 'create-vault' | 'vault';
};

export const Navigation: FC<NavigationProps> = ({ mode = 'root' }) => {
  const NavigationContent = useMemo(() => {
    switch (mode) {
      case 'root':
        return RootNavigation;
      case 'vault':
        return VaultNavigation;
      default:
      case 'create-vault':
        return CreateVaultNavigation;
    }
  }, [mode]);

  return (
    <NavigationContainer>
      {NavigationContent && <NavigationContent />}
      <FeedbackLink target="_blank" href={FEEDBACK_SURVEY_URL}>
        Leave feedback <External />
      </FeedbackLink>
    </NavigationContainer>
  );
};
