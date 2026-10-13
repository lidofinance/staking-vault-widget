import { Text } from '@lidofinance/lido-ui';

import { InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';

import { useWithdrawData } from '../../hooks';

import { Container, LastMetrics, MetricItem } from './styles';

export const DescriptionAndMetrics = () => {
  const {
    totalValue,
    isTotalValueLoading,
    availableBalance,
    isAvailableBalanceLoading,
  } = useWithdrawData();

  return (
    <Container>
      <InlineLoader isLoading={isAvailableBalanceLoading} height={24}>
        <Text size="xs">
          {availableBalance > 0n
            ? 'Disconnection and ownership transfer have been completed. You can now withdraw the available stVault Balance, including the connection deposit.'
            : 'Disconnection and ownership transferring has been completed.'}
        </Text>
      </InlineLoader>
      <LastMetrics>
        <InlineLoader isLoading={isTotalValueLoading} width={80}>
          {totalValue > 0n && (
            <MetricItem>
              <Text size="xxs">Last known stVault Total Value</Text>
              <Text size="xxs" strong>
                <FormatToken amount={totalValue} symbol="ETH" />
              </Text>
            </MetricItem>
          )}
        </InlineLoader>
        <InlineLoader isLoading={isAvailableBalanceLoading}>
          <MetricItem data-testid="withdrawable-balance">
            <Text size="xxs">Withdrawable stVault Balance</Text>
            <Text size="xxs" strong data-testid="value">
              <FormatToken amount={availableBalance} symbol="ETH" />
            </Text>
          </MetricItem>
        </InlineLoader>
      </LastMetrics>
    </Container>
  );
};
