import { Text, Loader } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';
import { useSimulationFund } from 'features/supply/fund/hooks';

import { AmountInfo, InfoRow, Wrapper } from './styles';
import { useVaultInfo } from 'features/overview/contexts';

export const FeatureTxInfo = () => {
  // TODO: simulate tx, add tx price, convert ETH to stEth
  // TODO: add question info
  const { getValues } = useFormContext();
  const { amount } = getValues();
  const { activeVault } = useVaultInfo();
  const { data, isLoading, isError } = useSimulationFund({
    address: activeVault?.address,
    amount: amount ?? 0,
  });

  return (
    <Wrapper>
      {/* <InfoRow>
        <Text size="xxs" color="secondary">
          You will receive
        </Text>
        <AmountInfo>
          <span>{'50 stETH'}</span>
          <StEthQuestion />
        </AmountInfo>
      </InfoRow> */}
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
        {data && <AmountInfo>{'$99.99'}</AmountInfo>}
        {!data && !isError && !isLoading && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
