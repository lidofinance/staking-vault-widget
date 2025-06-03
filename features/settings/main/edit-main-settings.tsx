import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import {
  MainSettingsAction,
  NodeOperator,
} from 'features/settings/main/components';
import { SectionContainer } from 'features/settings/main/styles';
import {
  MainSettingsDataProvider,
  MainSettingsProvider,
} from 'features/settings/main/contexts';

import { Voting } from './custom';
import { Admins } from './components';

export const EditMainSettings = () => {
  return (
    <>
      <MainSettingsDataProvider>
        <MainSettingsProvider>
          <SectionContainer>
            <Text size="lg" strong>
              {vaultTexts.actions.settings.title}
            </Text>
            <NodeOperator />
            <Admins />
            <Voting />
            <MainSettingsAction />
          </SectionContainer>
        </MainSettingsProvider>
      </MainSettingsDataProvider>
    </>
  );
};
