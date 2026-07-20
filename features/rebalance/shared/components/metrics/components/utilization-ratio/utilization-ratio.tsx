import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
  Text,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { InlineLoader, OldToNew } from 'shared/components';

import {
  useRebalanceMintingCapacityChart,
  useRebalanceProjectedOverview,
  useRebalanceState,
} from 'features/rebalance/hooks';

import { Container, TextContainer } from './styles';

export const UtilizationRatio = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { hasFormErrors } = useRebalanceState();

  const { utilizationRatio } = data ?? {};
  const chartData = useRebalanceMintingCapacityChart();

  return (
    <Container data-testid="utilization-ratio">
      <TextContainer>
        <Text size="xxs" as="span" data-testid="label">
          {vaultTexts.actions.rebalance.metrics.utilizationRatio}
        </Text>
        <InlineLoader isLoading={isPending} width={50} height={18}>
          <OldToNew
            old={utilizationRatio}
            supposed={projected?.utilizationRatio}
            isChanged={
              !!projected &&
              !hasFormErrors &&
              projected?.utilizationRatio !== utilizationRatio
            }
            dataTestId="value"
          />
        </InlineLoader>
      </TextContainer>
      <ChartLine
        loading={isPending}
        border={ChartLineBorderType.rounded}
        thresholdType={ChartLineThresholdType.dash}
        data={chartData}
        height={8}
        showLabels
        data-testid="possible-minting-capacity-chart"
      />
    </Container>
  );
};
