import { Text, Loader } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';
import { useSimulationFund } from 'features/supply/fund/hooks';
import { useVaultInfo } from 'features/overview/contexts';

import { AmountInfo, InfoRow, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const amount: bigint | undefined = watch('amount');
  const { activeVault } = useVaultInfo();
  const { data, isLoading, isError } = useSimulationFund({
    address: activeVault?.owner,
    amount: amount ?? 0n,
  });

  return (
    <Wrapper>
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
