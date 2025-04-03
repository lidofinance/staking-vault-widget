import { useFormContext } from 'react-hook-form';
import { useSimulationMintWithDelegation } from 'features/adjustment/mint/hooks/use-mint-with-delegation';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [token, amount, recipient] = watch(['token', 'amount', 'recipient']);
  const { isLoading, data, isError } = useSimulationMintWithDelegation({
    token,
    amount,
    recipient,
  });

  // TODO: add error
  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Transaction cost
        </Text>
        {isLoading && <Loader size="small" />}
        {/*TODO: replace static by real data*/}
        {data && <AmountInfo>{'$99.99'}</AmountInfo>}
        {isError && <AmountInfo>Is not available</AmountInfo>}
        {!isLoading && !data && !isError && <AmountInfo>{'$0'}</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
