import { useBalance } from 'wagmi';
import { useDappStatus, useWstethBalance } from 'modules/web3';

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
    data: wstethBalance,
    isLoading: isWstethLoading,
    isSuccess: isWstethSuccess,
    isError: isWstethError,
  } = useWstethBalance({ account: address });
  const token = watch('token');

  const isLoading = isEthLoading || isWstethLoading;
  const isSuccess = isEthSuccess || isWstethSuccess;
  const isError = isEthError || isWstethError;
  const balance = token === 'ETH' ? ethBalance?.value : wstethBalance;

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
