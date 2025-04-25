import { AmountInfo, InfoRow, Wrapper } from './styles';
import { Loader, Text } from '@lidofinance/lido-ui';
import { useSimulateContract } from 'wagmi';
import { dashboardAbi } from 'abi/dashboard-abi';
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
  const { isLoading, data, isError, isFetching } = useSimulateContract({
    abi: dashboardAbi,
    address: owner,
    functionName,
    args: [amountAsArg],
    query: {
      enabled: isEnabled,
    },
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
        {data?.result && <AmountInfo>{'$0.99'}</AmountInfo>}
        {isError && !showLoader && <AmountInfo>Is not available</AmountInfo>}
        {!showLoader && !data?.result && !isError && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
