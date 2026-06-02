import { Text } from '@lidofinance/lido-ui';

import { InlineLoader } from 'shared/components';
import { useVaultOverviewData } from 'modules/vaults';

import { HealthFactorIndicator, ListItem } from './styles';

export const HeathFactor = () => {
  const { isPending, data } = useVaultOverviewData();

  const { healthFactorNumber = 0, healthFactor } = data ?? {};

  return (
    <ListItem>
      <Text size="xxs" as="span">
        Health factor
      </Text>
      <InlineLoader isLoading={isPending} width={45} height={20}>
        <HealthFactorIndicator $indicator={healthFactorNumber}>
          {healthFactor}
        </HealthFactorIndicator>
      </InlineLoader>
    </ListItem>
  );
};
