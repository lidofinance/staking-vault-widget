import { Text } from '@lidofinance/lido-ui';

import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';

import { Container, ValueContainer } from './styles';

export const Liability = () => {
  const { data, isPending } = useVaultOverviewData();
  const { vaultLiability } = data ?? {};

  // TODO: use old to new
  return (
    <Container>
      <Text size="xxs" as="span">
        {vaultTexts.actions.rebalance.metrics.liability}
      </Text>
      <ValueContainer>
        <InlineLoader isLoading={isPending} width={80} height={18}>
          <Text size="xxs" as="span" color="secondary">
            <FormatToken amount={vaultLiability} symbol="stETH" />
          </Text>
        </InlineLoader>
      </ValueContainer>
    </Container>
  );
};
