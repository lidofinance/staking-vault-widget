import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
  Text,
} from '@lidofinance/lido-ui';

import { useRemainingMintingCapacityChart } from 'shared/hooks';
import { vaultTexts } from 'modules/vaults';
import { InlineLoader, OldToNew } from 'shared/components';

import { useRebalanceProjectedOverview } from 'features/rebalance/hooks';

import { Container, TextContainer } from './styles';

export const UtilizationRatio = () => {
  const { data, isPending, projected } = useRebalanceProjectedOverview();
  const { utilizationRatio } = data ?? {};
  const chartData = useRemainingMintingCapacityChart();

  return (
    <Container>
      <TextContainer>
        <Text size="xxs" as="span">
          {vaultTexts.actions.rebalance.metrics.utilizationRatio}
        </Text>
        <InlineLoader isLoading={isPending} width={50} height={18}>
          <OldToNew
            old={utilizationRatio}
            supposed={projected?.utilizationRatio}
            isChanged={
              !!projected && projected?.utilizationRatio !== utilizationRatio
            }
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
