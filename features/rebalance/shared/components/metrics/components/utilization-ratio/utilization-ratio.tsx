import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
  Text,
} from '@lidofinance/lido-ui';

import { useRemainingMintingCapacityChart } from 'shared/hooks';
import { useVaultOverviewData } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { Container, TextContainer } from './styles';

export const UtilizationRatio = () => {
  const { data, isPending } = useVaultOverviewData();
  const { utilizationRatio } = data ?? {};
  const chartData = useRemainingMintingCapacityChart();

  // TODO: add old to new if it has diffs
  // TODO: add text to vault texts
  return (
    <Container>
      <TextContainer>
        <Text size="xxs" as="span">
          Utilization ratio
        </Text>
        <InlineLoader isLoading={isPending} width={50} height={18}>
          <Text size="xxs" color="secondary" as="span">
            {utilizationRatio}
          </Text>
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
