import { useBalance } from 'wagmi';
import { useDappStatus, useWethBalance } from 'modules/web3';

import { Text, Loader } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { formatBalance } from 'utils';
import { useFormContext } from 'react-hook-form';

export const Balance = () => {
  const { watch } = useFormContext();
  const { address } = useDappStatus();
  const {
    data: ethBalance,
    isLoading: isEthLoading,
    isSuccess: isEthSuccess,
    isError: isEthError,
  } = useBalance({ address });
  const {
    data: wethBalance,
    isLoading: isWethLoading,
    isSuccess: isWethSuccess,
    isError: isWethError,
  } = useWethBalance({ account: address });
  const token = watch('token');

  const isLoading = isEthLoading || isWethLoading;
  const isSuccess = isEthSuccess || isWethSuccess;
  const isError = isEthError || isWethError;
  const balance = token === 'ETH' ? ethBalance?.value : wethBalance;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to Supply
        </Text>
        {isLoading && <Loader size="small" />}
        {isSuccess && !isLoading && (
          <AmountInfo>
            {formatBalance(balance).trimmed} {token}
          </AmountInfo>
        )}
        {isError && <AmountInfo>Balance is not available</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
