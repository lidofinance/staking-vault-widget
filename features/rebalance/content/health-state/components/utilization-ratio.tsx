import { Text } from '@lidofinance/lido-ui';

import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ListItem, UtilizationRatioIndicator } from './styles';

export const UtilizationRatio = () => {
  const { data, isPending } = useVaultOverviewData();
  const { utilizationRatio, utilizationRatioNumber } = data ?? {};

  return (
    <ListItem data-testid="utilization-ratio">
      <Text size="xxs" data-testid="label">
        {vaultTexts.actions.rebalance.healthState.utilizationRatio}
      </Text>
      <InlineLoader isLoading={isPending} width={45} height={20}>
        <UtilizationRatioIndicator
          $ratio={utilizationRatioNumber}
          data-testid="value"
        >
          {utilizationRatio}
        </UtilizationRatioIndicator>
      </InlineLoader>
    </ListItem>
  );
};
