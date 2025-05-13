import { FC } from 'react';
import { External } from '@lidofinance/lido-ui';

import { Nav, FeedbackLink } from './styles';
import { FEEDBACK_SURVEY_URL } from 'consts/external-links';
import { RootNavigation } from './modes/root';
import { VaultNavigation } from './modes/vault';
import { CreateVaultNavigation } from './modes/create-vault';

type NavigationProps = {
  mode?: 'root' | 'create-vault' | 'vault';
};

export const Navigation: FC<NavigationProps> = ({ mode = 'root' }) => {
  const NavigationContent = (() => {
    switch (mode) {
      case 'root':
        return RootNavigation;
      case 'vault':
        return VaultNavigation;
      default:
      case 'create-vault':
        return CreateVaultNavigation;
    }
  })();

  return (
    <Nav>
      {NavigationContent && <NavigationContent />}

      <FeedbackLink target="_blank" href={FEEDBACK_SURVEY_URL}>
        Leave feedback <External />
      </FeedbackLink>
    </Nav>
  );
};
