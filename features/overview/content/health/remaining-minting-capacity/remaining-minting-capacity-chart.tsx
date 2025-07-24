import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { useRemainingMintingCapacityChart } from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

export const RemainingMintingCapacityChart = () => {
  const { isLoadingVault } = useVaultOverview();
  const chartData = useRemainingMintingCapacityChart();

  if (isLoadingVault) return null;

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
