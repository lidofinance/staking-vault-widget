import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { useVaultInfo } from 'modules/vaults';
import { formatBalance } from 'utils';

export const useWithdrawChart = () => {
  const { activeVault } = useVaultInfo();

  return useMemo(() => {
    if (!activeVault) return {};

    const { withdrawableEther, totalValue } = activeVault;

    const totalValueAmount = formatBalance(totalValue).trimmed;
    const withdrawableEthAmount = formatBalance(withdrawableEther).trimmed;
    const notWithdrawableEthAmount = formatBalance(
      totalValue - withdrawableEther,
    ).trimmed;

    return {
      totalValueAmount,
      withdrawableEthAmount,
      notWithdrawableEthAmount,
      chartData: [
        {
          color: '#00A3FF',
          labelPosition: 'top',
          threshold: {
            description: `Available for Immediate Withdrawal ${withdrawableEthAmount} ETH`,
            label: `${withdrawableEthAmount} ETH`,
            value: parseFloat(withdrawableEthAmount),
          },
        },
        {
          color: '#B35FE0',
          labelPosition: 'top',
          threshold: {
            description: `Total value ${totalValueAmount} ETH`,
            label: `${totalValueAmount} ETH`,
            value: parseFloat(totalValueAmount),
          },
        },
      ] as LineData[],
    };
  }, [activeVault]);
};
