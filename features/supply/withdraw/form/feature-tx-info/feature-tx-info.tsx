import { useFormContext } from 'react-hook-form';
import { useSimulateWithDelegation } from 'features/supply/withdraw/hooks';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [recipient, amount] = watch(['recipient', 'amount']);
  const { isLoading, isError, data } = useSimulateWithDelegation({
    recipient,
    amount,
  });

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          You will receive
        </Text>
        <AmountInfo>{'50 ETH'}</AmountInfo>
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
        {/*TODO: replace by real data*/}
        {data && <AmountInfo>{'$99.99'}</AmountInfo>}
        {!data && !isError && !isLoading && <AmountInfo>${'0'}</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
