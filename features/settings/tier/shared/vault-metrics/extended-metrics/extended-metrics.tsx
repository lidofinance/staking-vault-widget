import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { useTierData } from 'features/settings/tier/contexts';
import { SectionData } from 'features/settings/tier/types';

import { List, ListItem } from './styles';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'totalMintingCapacityAmountStETH',
  },
  {
    indicator: 'utilizationRatio',
  },
  {
    indicator: 'reserveRatio',
  },
  {
    indicator: 'rebalanceThreshold',
  },
  {
    indicator: 'lidoInfraFee',
  },
  {
    indicator: 'lidoLiquidityFee',
  },
];

export const ExtendedMetrics = () => {
  const { getTierDataToRender } = useTierData();
  const dataToRender = useMemo(
    () => sectionPayloadList.map((item) => getTierDataToRender(item)),
    [getTierDataToRender],
  );

  return (
    <List>
      {dataToRender.map((item) => (
        <ListItem key={item.indicator}>
          <Text size="xxs">{item.title}</Text>
          <Text size="xxs">{item.payload}</Text>
        </ListItem>
      ))}
    </List>
  );
};
