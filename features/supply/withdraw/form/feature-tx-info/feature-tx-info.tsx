import { useFormContext } from 'react-hook-form';
import { useSimulateWithdrawDashboard } from 'features/supply/withdraw/hooks';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import { formatBalance } from 'utils';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [recipient, amount] = watch(['recipient', 'amount']);
  const { isLoading, isError, data } = useSimulateWithdrawDashboard({
    recipient,
    amount,
  });

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          You will receive
        </Text>
        <AmountInfo>{formatBalance(amount ?? 0n).trimmed} ETH</AmountInfo>
      </InfoRow>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Transaction cost
        </Text>
        {isLoading && <Loader size="small" />}
        {isError && (
          <Text size="xxs" color="secondary">
            Can&apos;t load gas simulation info
          </Text>
        )}
        {!!data?.result && !isLoading && (
          <AmountInfo>{data?.result}</AmountInfo>
        )}
        {!data?.result && !isError && !isLoading && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
