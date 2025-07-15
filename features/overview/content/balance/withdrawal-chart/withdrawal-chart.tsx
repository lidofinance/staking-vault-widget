import {
  Text,
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { useWithdrawChart } from 'features/overview/inner';

import { useVaultOverview } from 'features/overview/vault-overview';

import { List, ListItem } from './styles';

export const WithdrawalChart = () => {
  const { isLoadingVault } = useVaultOverview();
  const { chartData } = useWithdrawChart();

  if (isLoadingVault || !chartData) return null;

  return (
    <>
      <ChartLine
        border={ChartLineBorderType.rounded}
        thresholdType={ChartLineThresholdType.dash}
        data={chartData}
        height={8}
        showLabels
      />
      <List>
        <ListItem color="withdrawable">
          <Text size="xxs" color="secondary">
            Available for Immediate Withdrawal
          </Text>
        </ListItem>
        <ListItem color="notWithdrawable">
          <Text size="xxs" color="secondary">
            Not withdrawable
          </Text>
        </ListItem>
      </List>
    </>
  );
};
