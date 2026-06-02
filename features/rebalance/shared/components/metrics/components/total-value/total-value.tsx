import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { InlineLoader, OldToNew } from 'shared/components';
import { FormatToken } from 'shared/formatters';

import { useRebalanceProjectedOverview } from 'features/rebalance/hooks';

import { Container, ValueContainer } from './styles';

export const TotalValue = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { totalValue } = data ?? {};

  return (
    <Container>
      <Text size="xxs" as="span">
        {vaultTexts.actions.rebalance.metrics.totalValue}
      </Text>
      <ValueContainer>
        <InlineLoader isLoading={isPending} width={80} height={18}>
          <OldToNew
            old={<FormatToken amount={totalValue} symbol="ETH" />}
            supposed={
              <FormatToken amount={projected?.totalValue} symbol="ETH" />
            }
            isChanged={!!projected && projected?.totalValue !== totalValue}
          />
        </InlineLoader>
      </ValueContainer>
    </Container>
  );
};
