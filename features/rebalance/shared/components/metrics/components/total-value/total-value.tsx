import { Text } from '@lidofinance/lido-ui';

import { useVaultOverviewData } from 'modules/vaults';
import { InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';

import { Container, ValueContainer } from './styles';

export const TotalValue = () => {
  const { data, isPending } = useVaultOverviewData();
  const { totalValue } = data ?? {};

  // TODO: add text to vault texts
  // TODO: use old to new
  return (
    <Container>
      <Text size="xxs" as="span">
        Total Value
      </Text>
      <ValueContainer>
        <InlineLoader isLoading={isPending} width={80} height={18}>
          <Text size="xxs" as="span" color="secondary">
            <FormatToken amount={totalValue} symbol="ETH" />
          </Text>
        </InlineLoader>
      </ValueContainer>
    </Container>
  );
};
