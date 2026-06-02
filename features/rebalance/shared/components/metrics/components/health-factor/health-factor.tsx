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

import { useRebalanceProjectedOverview } from 'features/rebalance/hooks';

import { Container, TextContainer } from './styles';

export const HealthFactor = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { healthFactorNumber, healthFactor } = data ?? {};
  const { chartData } = useHealthChart(healthFactorNumber);

  return (
    <Container>
      <TextContainer>
        <Text size="xxs" as="span">
          {vaultTexts.actions.rebalance.metrics.healthFactor}
        </Text>
        <InlineLoader isLoading={isPending} width={50} height={18}>
          <OldToNew
            old={healthFactor}
            supposed={projected?.healthFactor}
            isChanged={!!projected && projected?.healthFactor !== healthFactor}
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
