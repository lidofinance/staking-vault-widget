import { Text } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

export const Description = () => {
  const isSupplyEth = useWatch<RebalanceFormFieldValues>({
    name: 'isSupplyEth',
  });

  if (!isSupplyEth) {
    return null;
  }

  return (
    <Text size="xxs" color="secondary">
      You can supply ETH into the stVault in the same transaction as rebalance,
      to reduce gas expenses.
    </Text>
  );
};
