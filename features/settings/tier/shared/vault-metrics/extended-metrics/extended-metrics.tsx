import { Text } from '@lidofinance/lido-ui';
import { List, ListItem } from './styles';

export const ExtendedMetrics = () => {
  return (
    <List>
      <ListItem>
        <Text size="xxs">stVault minting capacity</Text>
        <Text size="xxs">9 000 stETH</Text>
      </ListItem>
      <ListItem>
        <Text size="xxs">Utilization</Text>
        <Text size="xxs">52.94%</Text>
      </ListItem>
      <ListItem>
        <Text size="xxs">Reserve ratio</Text>
        <Text size="xxs">10%</Text>
      </ListItem>
      <ListItem>
        <Text size="xxs">Forced rebalance threshold</Text>
        <Text size="xxs">8%</Text>
      </ListItem>
      <ListItem>
        <Text size="xxs">Lido infrastructure fee</Text>
        <Text size="xxs">1.0%</Text>
      </ListItem>
      <ListItem>
        <Text size="xxs">Lido liquidity fee</Text>
        <Text size="xxs">6.5%</Text>
      </ListItem>
    </List>
  );
};
