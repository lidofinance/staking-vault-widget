import { Text } from '@lidofinance/lido-ui';

import { InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { ONE_ETHER } from 'consts/tx';

import { ListItem } from './styles';

export const StEthLiability = () => {
  const { isPending, data } = useVaultOverviewData();

  const { vaultLiabilityStETH: vaultLiability = 0n } = data ?? {};
  const maxDecimalDigits = vaultLiability / ONE_ETHER > 100 ? 1 : 4;

  return (
    <ListItem data-testid="steth-liability">
      <Text size="xxs" as="span" data-testid="label">
        {vaultTexts.actions.rebalance.healthState.stethLiability}
      </Text>
      <InlineLoader isLoading={isPending} width={45} height={20}>
        <Text size="xxs" as="span" strong data-testid="value">
          <FormatToken
            amount={vaultLiability}
            maxDecimalDigits={maxDecimalDigits}
            symbol="stETH"
          />
        </Text>
      </InlineLoader>
    </ListItem>
  );
};
