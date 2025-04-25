import { useFormContext } from 'react-hook-form';
import { useSimulateWithdrawDashboard } from 'features/supply/withdraw/hooks';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import { formatBalance } from '../../../../../utils';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [recipient, amount] = watch(['recipient', 'amount']);
  const { isLoading, isFetching, isError, data } = useSimulateWithdrawDashboard(
    {
      recipient,
      amount,
    },
  );
  const showLoader = isLoading || isFetching;

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
        {showLoader && <Loader size="small" />}
        {isError && (
          <Text size="xxs" color="secondary">
            Can&apos;t load gas simulation info
          </Text>
        )}
        {/* TODO: fix simulation */}
        {data?.result && !showLoader && <AmountInfo>{'$0.99'}</AmountInfo>}
        {!data?.result && !isError && !showLoader && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
