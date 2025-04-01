import { useFormContext } from 'react-hook-form';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import { useSimulationClaimWithDelegation } from 'modules/web3/hooks/use-claim-with-delegation';

export const FeatureTxInfo = () => {
  const { getValues } = useFormContext();
  const { recipient } = getValues();
  const { data, isLoading, isError } =
    useSimulationClaimWithDelegation(recipient);

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Transaction cost
        </Text>
        {isLoading && <Loader size="small" />}
        {data && <AmountInfo>{'$99.99'}</AmountInfo>}
        {isError && <AmountInfo>Is not available</AmountInfo>}
        {!isLoading && !data && !isError && <AmountInfo>{'$0'}</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
