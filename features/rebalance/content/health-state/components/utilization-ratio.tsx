import { Text } from '@lidofinance/lido-ui';

import { useVaultOverviewData } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ListItem, UtilizationRatioIndicator } from './styles';

export const UtilizationRatio = () => {
  const { data, isPending } = useVaultOverviewData();
  const { utilizationRatio, utilizationRatioNumber } = data ?? {};

  return (
    <ListItem>
      <Text size="xxs">Utilization ratio</Text>
      <InlineLoader isLoading={isPending} width={45} height={20}>
        <UtilizationRatioIndicator $ratio={utilizationRatioNumber}>
          {utilizationRatio}
        </UtilizationRatioIndicator>
      </InlineLoader>
    </ListItem>
  );
};
