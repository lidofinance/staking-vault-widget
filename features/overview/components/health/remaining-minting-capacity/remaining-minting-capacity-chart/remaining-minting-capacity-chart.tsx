import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { useVaultOverview } from 'features/overview/contexts';
import { useRemainingMintingCapacityChart } from 'features/overview/hooks';

export const RemainingMintingCapacityChart = () => {
  const { isLoadingVault } = useVaultOverview();
  const chartData = useRemainingMintingCapacityChart();

  return (
    <ChartLine
      loading={isLoadingVault && !!chartData}
      border={ChartLineBorderType.rounded}
      thresholdType={ChartLineThresholdType.dash}
      data={chartData}
      height={8}
      showLabels
    />
  );
};
