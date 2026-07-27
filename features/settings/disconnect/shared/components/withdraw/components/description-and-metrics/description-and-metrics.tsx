import { Text } from '@lidofinance/lido-ui';

import { InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';

import { useValidatorsBalance } from 'features/settings/disconnect/shared/components/initiate-disconnect/hooks';

import { useWithdrawData } from '../../hooks';

import { Container, LastMetrics, MetricItem } from './styles';

export const DescriptionAndMetrics = () => {
  const {
    totalValue,
    isTotalValueLoading,
    availableBalance,
    isAvailableBalanceLoading,
  } = useWithdrawData();
  const { totalBalance: validatorsBalance, isLoading: isValidatorsLoading } =
    useValidatorsBalance();

  return (
    <Container>
      <Text size="xs">
        Disconnection and ownership transfer have been completed. You can now
        withdraw the available stVault Balance, including the connection
        deposit.
      </Text>
      <LastMetrics>
        <MetricItem>
          <Text size="xxs">Last known stVault Total Value</Text>
          <InlineLoader isLoading={isTotalValueLoading}>
            <Text size="xxs" strong>
              <FormatToken amount={totalValue} symbol="ETH" />
            </Text>
          </InlineLoader>
        </MetricItem>
        <MetricItem>
          <Text size="xxs">Last known validators balance</Text>
          <InlineLoader isLoading={isValidatorsLoading}>
            <Text size="xxs" strong>
              <FormatToken amount={validatorsBalance} symbol="ETH" />
            </Text>
          </InlineLoader>
        </MetricItem>
        <MetricItem>
          <Text size="xxs">Withdrawable stVault Balance</Text>
          <InlineLoader isLoading={isAvailableBalanceLoading}>
            <Text size="xxs" strong>
              <FormatToken amount={availableBalance} symbol="ETH" />
            </Text>
          </InlineLoader>
        </MetricItem>
      </LastMetrics>
    </Container>
  );
};
