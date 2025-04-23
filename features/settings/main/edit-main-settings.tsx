import { Text } from '@lidofinance/lido-ui';
import {
  MainSettingsAction,
  DataField,
  NodeOperator,
} from 'features/settings/main/components';
import { SectionContainer } from 'features/settings/main/styles';
import { MainSettingsProvider } from 'features/settings/main/contexts';

import { fieldsForRender } from './consts';

export const EditMainSettings = () => {
  return (
    <MainSettingsProvider>
      <SectionContainer>
        <Text size="lg" strong>
          Main settings
        </Text>
        <NodeOperator />
        {fieldsForRender.map((field) => (
          <DataField key={field.vaultKey} {...field} />
        ))}
        <MainSettingsAction />
      </SectionContainer>
    </MainSettingsProvider>
  );
};
