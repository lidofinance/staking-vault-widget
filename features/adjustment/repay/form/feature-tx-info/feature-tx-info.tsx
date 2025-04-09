import { AmountInfo, InfoRow, Wrapper } from './styles';
import { Loader, Text } from '@lidofinance/lido-ui';
import { useSimulateContract } from 'wagmi';
import { DelegationAbi } from 'abi/delegation';
import { useVaultInfo } from 'features/overview/contexts';
import { useFormContext } from 'react-hook-form';

export const FeatureTxInfo = () => {
  const { activeVault } = useVaultInfo();
  const { watch } = useFormContext();
  const [token, amount] = watch(['token', 'amount']);
  const owner = activeVault?.owner;
  const isEnabled = !!owner && !!amount;
  const amountAsArg = amount ? BigInt(amount) : BigInt(0);
  const functionName = token === 'stETH' ? 'burnStETH' : 'burnWstETH';
  const { isLoading, data, isError } = useSimulateContract({
    abi: DelegationAbi,
    address: owner,
    functionName,
    args: [amountAsArg],
    query: {
      enabled: isEnabled,
    },
  });

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
