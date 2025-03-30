import { Text, Loader } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';
import { useSimulationFundWithDelegation } from 'modules/web3/hooks/use-fund-with-delegation';
import { useVaults } from 'providers/vaults';

import { AmountInfo, InfoRow, StEthQuestion, Wrapper } from './styles';

export const FeatureTxInfo = () => {
  // TODO: simulate tx, add tx price, convert ETH to stEth
  // TODO: add question info
  const { getValues } = useFormContext();
  const { token, amount } = getValues();
  const { activeVault } = useVaults();
  const { data, isLoading, isError } = useSimulationFundWithDelegation({
    token: token,
    address: activeVault?.address,
    amount: amount ?? 0,
  });

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          You will receive
        </Text>
        <AmountInfo>
          <span>{'50 stETH'}</span>
          <StEthQuestion />
        </AmountInfo>
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
        {data && <AmountInfo>{'$99.99'}</AmountInfo>}
        {!data && !isError && !isLoading && <AmountInfo>${'0'}</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
