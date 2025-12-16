import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { formatBalance } from 'utils';

import { useVaultOverview } from 'features/overview/vault-overview';
import { normalizeChartBN } from './utils';

export const useWithdrawChart = () => {
  const { values } = useVaultOverview();

  return useMemo(() => {
    if (!values) return {};

    const totalValue = values.totalValue;
    const withdrawableEther = values.vaultData.withdrawableEther;

    const totalValueAmount = formatBalance(totalValue).trimmed;
    const withdrawableEthAmount = formatBalance(withdrawableEther).trimmed;
    const notWithdrawableAmount = totalValue - withdrawableEther;

    return {
      totalValueAmount,
      withdrawableEthAmount,
      notWithdrawableAmount,
      chartData: [
        {
          color: '#00A3FF',
          labelPosition: 'top',
          threshold: {
            description: `Available for Immediate Withdrawal ${withdrawableEthAmount} ETH`,
            label: `${withdrawableEthAmount} ETH`,
            value: normalizeChartBN(withdrawableEther),
          },
        },
        {
          color: '#B35FE0',
          labelPosition: 'top',
          threshold: {
            description: `Total value ${totalValueAmount} ETH`,
            label: `${totalValueAmount} ETH`,
            value: normalizeChartBN(totalValue),
          },
        },
      ] as LineData[],
    };
  }, [values]);
};
