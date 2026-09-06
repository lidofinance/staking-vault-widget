import { Text } from '@lidofinance/lido-ui';

import { InlineLoader } from 'shared/components';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';

import { HealthFactorIndicator, ListItem } from './styles';

export const HeathFactor = () => {
  const { isPending, data } = useVaultOverviewData();

  const { healthFactorNumber = 0, healthFactor } = data ?? {};

  return (
    <ListItem data-testid="health-factor">
      <Text size="xxs" as="span" data-testid="label">
        {vaultTexts.actions.rebalance.healthState.healthFactor}
      </Text>
      <InlineLoader isLoading={isPending} width={45} height={20}>
        <HealthFactorIndicator
          $indicator={healthFactorNumber}
          data-testid="value"
        >
          {healthFactor}
        </HealthFactorIndicator>
      </InlineLoader>
    </ListItem>
  );
};
