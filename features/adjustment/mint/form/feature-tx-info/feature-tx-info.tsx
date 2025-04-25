import { useFormContext } from 'react-hook-form';
import { useSimulationMintDashboard } from 'features/adjustment/mint/hooks';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const [token, amount, recipient] = watch(['token', 'amount', 'recipient']);
  const { isLoading, isFetching, data, isError } = useSimulationMintDashboard({
    token,
    amount,
    recipient,
  });
  const showLoader = isLoading || isFetching;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Transaction cost
        </Text>
        {showLoader && <Loader size="small" />}
        {/*TODO: replace static by real data*/}
        {data?.result && !showLoader && <AmountInfo>{'$0.99'}</AmountInfo>}
        {isError && !showLoader && <AmountInfo>Is not available</AmountInfo>}
        {!showLoader && !data?.result && !isError && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
