import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { InlineLoader, OldToNew } from 'shared/components';
import { FormatToken } from 'shared/formatters';

import { useRebalanceProjectedOverview } from 'features/rebalance/hooks';

import { Container, ValueContainer } from './styles';

export const Liability = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { vaultLiability } = data ?? {};

  return (
    <Container>
      <Text size="xxs" as="span">
        {vaultTexts.actions.rebalance.metrics.liability}
      </Text>
      <ValueContainer>
        <InlineLoader isLoading={isPending} width={80} height={18}>
          <OldToNew
            old={<FormatToken amount={vaultLiability} symbol="stETH" />}
            supposed={
              <FormatToken amount={projected?.vaultLiability} symbol="stETH" />
            }
            isChanged={
              !!projected && projected?.vaultLiability !== vaultLiability
            }
          />
        </InlineLoader>
      </ValueContainer>
    </Container>
  );
};
