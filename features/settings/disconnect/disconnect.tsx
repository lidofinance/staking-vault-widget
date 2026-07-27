import { vaultTexts } from 'modules/vaults';

import { ContentWrapper } from 'features/settings/shared/components';

import {
  DisconnectDescription,
  DisconnectSteps,
  BackToSettings,
} from './content';

import { DisconnectPage, Title, Content } from './styles';

const { settingsTitle } = vaultTexts.actions.disconnect;

export const DisconnectVault = () => {
  return (
    <DisconnectPage>
      <BackToSettings />
      <ContentWrapper>
        <Content>
          <Title data-testid="title" as="h2">
            {settingsTitle}
          </Title>
          <DisconnectDescription />
          <DisconnectSteps />
        </Content>
      </ContentWrapper>
    </DisconnectPage>
  );
};
