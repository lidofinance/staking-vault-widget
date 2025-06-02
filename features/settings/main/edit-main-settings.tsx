import { Text } from '@lidofinance/lido-ui';

import {
  MainSettingsAction,
  ManagerAddressField,
  NodeOperator,
} from 'features/settings/main/components';
import { SectionContainer } from 'features/settings/main/styles';
import {
  MainSettingsDataProvider,
  MainSettingsProvider,
} from 'features/settings/main/contexts';

import { adminsForRender } from './consts';

import { VotingForm } from './custom';
import { NewForm } from './new';

export const EditMainSettings = () => {
  return (
    <>
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
            {/* {indicatorsForRender.map((field) => (
            <DataVotingField key={field.vaultKey} {...field} />
          ))} */}
            <VotingForm />
            <MainSettingsAction />
          </SectionContainer>
        </MainSettingsProvider>
      </MainSettingsDataProvider>
      <NewForm />
    </>
  );
};
