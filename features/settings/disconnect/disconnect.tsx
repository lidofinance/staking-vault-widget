import { ContentWrapper } from 'features/settings/shared/components';

import {
  DisconnectDescription,
  DisconnectSteps,
  BackToSettings,
  DisconnectTitle,
} from './content';

import { DisconnectPage, Content } from './styles';

export const DisconnectVault = () => {
  return (
    <DisconnectPage data-testid="disconnect-page">
      <BackToSettings />
      <ContentWrapper>
        <Content>
          <DisconnectTitle />
          <DisconnectDescription />
          <DisconnectSteps />
        </Content>
      </ContentWrapper>
    </DisconnectPage>
  );
};
