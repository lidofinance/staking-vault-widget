import { Text } from '@lidofinance/lido-ui';
import {
  MainSettingsAction,
  DataField,
  DataManagerField,
  NodeOperator,
} from 'features/settings/main/components';
import { SectionContainer } from 'features/settings/main/styles';
import { MainSettingsProvider } from 'features/settings/main/contexts';

import { indicatorsForRender, adminsForRender } from './consts';

export const EditMainSettings = () => {
  return (
    <MainSettingsProvider>
      <SectionContainer>
        <Text size="lg" strong>
          Main settings
        </Text>
        <NodeOperator />
        {indicatorsForRender.map((field) => (
          <DataField key={field.vaultKey} {...field} />
        ))}
        {adminsForRender.map((field) => (
          <DataManagerField key={field.vaultKey} {...field} />
        ))}
        <MainSettingsAction />
      </SectionContainer>
    </MainSettingsProvider>
  );
};
