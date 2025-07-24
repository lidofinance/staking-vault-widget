import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import {
  MainSettingsAction,
  NodeOperator,
  NodeOperatorFeeRecipient,
  Admins,
  Voting,
} from 'features/settings/main/components';
import {
  SectionContainer,
  ContentWrapper,
} from 'features/settings/shared/components';
import {
  MainSettingsDataProvider,
  MainSettingsProvider,
} from 'features/settings/main/contexts';

export const EditMainSettings = () => {
  return (
    <MainSettingsDataProvider>
      <MainSettingsProvider>
        <ContentWrapper>
          <SectionContainer>
            <Text size="lg" strong>
              {vaultTexts.actions.settings.title}
            </Text>
            <NodeOperator />
            <Admins />
            <NodeOperatorFeeRecipient />
            <Voting />
            <MainSettingsAction />
          </SectionContainer>
        </ContentWrapper>
      </MainSettingsProvider>
    </MainSettingsDataProvider>
  );
};
