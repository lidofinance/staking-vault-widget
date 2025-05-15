import { Text } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';

import { AllVaults, ArrowBackStyled } from './styles';

export const BackAllVaults = () => (
  <AllVaults href={appPaths.vaults.all}>
    <ArrowBackStyled />
    &nbsp;
    <Text size="xxs" strong>
      All vaults
    </Text>
  </AllVaults>
);
