import {
  ChartProportion,
  ChartProportionBorderType,
  ChartProportionBorderSize,
  MarginSize,
  Text,
} from '@lidofinance/lido-ui';

import { useHealthChart } from 'shared/hooks';
import { vaultTexts } from 'modules/vaults';
import { InlineLoader, OldToNew } from 'shared/components';

import {
  useRebalanceProjectedOverview,
  useRebalanceState,
} from 'features/rebalance/hooks';

import { Container, TextContainer } from './styles';

export const HealthFactor = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { hasFormErrors } = useRebalanceState();
  const { healthFactorNumber, healthFactor } = data ?? {};
  const { chartData } = useHealthChart(
    (!hasFormErrors && projected?.healthFactorNumber) || healthFactorNumber,
  );

  return (
    <Container data-testid="health-factor">
      <TextContainer>
        <Text size="xxs" as="span" data-testid="label">
          {vaultTexts.actions.rebalance.metrics.healthFactor}
        </Text>
        <InlineLoader isLoading={isPending} width={50} height={18}>
          <OldToNew
            old={healthFactor}
            supposed={projected?.healthFactor}
            isChanged={
              !!projected &&
              !hasFormErrors &&
              projected?.healthFactor !== healthFactor
            }
            dataTestId="value"
          />
        </InlineLoader>
      </TextContainer>
      <ChartProportion
        loading={isPending && !chartData}
        height={8}
        border={ChartProportionBorderType.rounded}
        margin={MarginSize.md}
        borderSize={ChartProportionBorderSize.md}
        data={chartData}
      />
    </Container>
  );
};
