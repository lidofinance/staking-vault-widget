import { Text } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
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
      {vaultTexts.actions.rebalance.supply.description}
    </Text>
  );
};
