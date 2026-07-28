import { vaultTexts } from 'modules/vaults';
import { StatusBadge } from 'shared/components';

import { TitleContainer, TitleHeading } from './styles';

const { settingsTitle } = vaultTexts.actions.disconnect;

export const DisconnectTitle = () => {
  return (
    <TitleContainer>
      <TitleHeading>{settingsTitle}</TitleHeading>
      <StatusBadge status="ongoing" />
    </TitleContainer>
  );
};
