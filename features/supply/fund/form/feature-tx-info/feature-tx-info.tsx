import { Text, Loader } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';
import { useSimulationFundWithDashboard } from 'features/supply/fund/hooks';

import { AmountInfo, InfoRow, Wrapper } from './styles';
import { useVaultInfo } from 'features/overview/contexts';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const amount: bigint | undefined = watch('amount');
  const { activeVault } = useVaultInfo();
  const { data, isLoading, isFetching, isError } =
    useSimulationFundWithDashboard({
      address: activeVault?.owner,
      amount: amount ?? 0n,
    });
  const showLoader = isLoading || isFetching;

  return (
    <Wrapper>
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
        {/* TODO: check result, useSimulationFundWithDashboard returns data.result === undefined  */}
        {!!data?.result && !showLoader && (
          <AmountInfo>{data?.result}</AmountInfo>
        )}
        {!data?.result && !isError && !showLoader && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
