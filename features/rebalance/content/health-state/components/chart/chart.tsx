import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { useVaultOverviewData } from 'modules/vaults';
import { useRemainingMintingCapacityChart } from 'shared/hooks';

export const Chart = () => {
  const { isPending } = useVaultOverviewData();
  const chartData = useRemainingMintingCapacityChart();

  return (
    <ChartLine
      loading={isPending}
      border={ChartLineBorderType.rounded}
      thresholdType={ChartLineThresholdType.dash}
      data={chartData}
      height={8}
      showLabels
      data-testid="remaining-minting-capacity-chart"
    />
  );
};
