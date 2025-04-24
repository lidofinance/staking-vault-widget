import { useFormContext } from 'react-hook-form';

import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import { useSimulationClaimDashboard } from 'features/claim/claim-form/hooks';
import { Address } from 'viem';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const recipient: Address = watch('recipient');
  const { data, isLoading, isError, isFetching } =
    useSimulationClaimDashboard(recipient);

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Transaction cost
        </Text>
        {(isLoading || isFetching) && <Loader size="small" />}
        {/*TODO: get simulated data*/}
        {/*TODO: show error message*/}
        {data && <AmountInfo>{'$0.99'}</AmountInfo>}
        {isError && <AmountInfo>-</AmountInfo>}
        {!isLoading && !data && !isError && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
