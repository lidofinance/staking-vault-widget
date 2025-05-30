import { Text } from '@lidofinance/lido-ui';

import {
  MainSettingsAction,
  DataVotingField,
  ManagerAddressField,
  NodeOperator,
} from 'features/settings/main/components';
import { SectionContainer } from 'features/settings/main/styles';
import {
  MainSettingsDataProvider,
  MainSettingsProvider,
} from 'features/settings/main/contexts';

import { indicatorsForRender, adminsForRender } from './consts';

export const EditMainSettings = () => {
  return (
    <MainSettingsDataProvider>
      <MainSettingsProvider>
        <SectionContainer>
          <Text size="lg" strong>
            Main settings
          </Text>
          <NodeOperator />
          {adminsForRender.map((field) => (
            <ManagerAddressField key={field.vaultKey} {...field} />
          ))}
          {indicatorsForRender.map((field) => (
            <DataVotingField key={field.vaultKey} {...field} />
          ))}
          <MainSettingsAction />
        </SectionContainer>
      </MainSettingsProvider>
    </MainSettingsDataProvider>
  );
};
