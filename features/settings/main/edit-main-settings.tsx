import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import {
  MainSettingsAction,
  NodeOperator,
  NodeOperatorFeeRecipient,
  Admins,
  Voting,
  ManageDeposits,
} from 'features/settings/main/components';
import {
  SectionContainer,
  ContentWrapper,
} from 'features/settings/shared/components';
import {
  MainSettingsDataProvider,
  MainSettingsProvider,
} from 'features/settings/main/contexts';

import { GroupWrapper, InputGroup, GroupHeading } from './styles';

const texts = vaultTexts.actions.settings;
export const EditMainSettings = () => {
  return (
    <MainSettingsDataProvider>
      <MainSettingsProvider>
        <ContentWrapper>
          <SectionContainer>
            <Text size="lg" strong data-testid="mainSettingsTitle">
              {texts.title}
            </Text>
            <ManageDeposits />
            <GroupWrapper>
              <GroupHeading as="h3">{texts.groups.address}</GroupHeading>
              <InputGroup>
                <NodeOperator />
                <Admins />
                <NodeOperatorFeeRecipient />
              </InputGroup>
            </GroupWrapper>
            <GroupWrapper>
              <GroupHeading as="h3">{texts.groups.settings}</GroupHeading>
              <InputGroup>
                <Voting />
              </InputGroup>
            </GroupWrapper>
            <MainSettingsAction />
          </SectionContainer>
        </ContentWrapper>
      </MainSettingsProvider>
    </MainSettingsDataProvider>
  );
};
