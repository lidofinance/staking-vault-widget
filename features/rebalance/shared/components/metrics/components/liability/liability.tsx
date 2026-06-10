import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { InlineLoader, OldToNew } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { calculateMaxDecimalDigits } from 'utils';

import { useRebalanceProjectedOverview } from 'features/rebalance/hooks';

import { Container, ValueContainer } from './styles';

export const Liability = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { vaultLiabilityStETH: vaultLiability } = data ?? {};

  return (
    <Container>
      <Text size="xxs" as="span">
        {vaultTexts.actions.rebalance.metrics.liability}
      </Text>
      <ValueContainer>
        <InlineLoader isLoading={isPending} width={80} height={18}>
          <OldToNew
            old={
              <FormatToken
                amount={vaultLiability}
                maxDecimalDigits={calculateMaxDecimalDigits(
                  vaultLiability,
                  100n,
                )}
                symbol="stETH"
              />
            }
            supposed={
              <FormatToken
                amount={projected?.vaultLiability}
                maxDecimalDigits={calculateMaxDecimalDigits(
                  projected?.vaultLiability,
                  100n,
                )}
                symbol="stETH"
              />
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
