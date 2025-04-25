import { AmountInfo, InfoRow, Wrapper } from './styles';
import { Loader } from '@lidofinance/lido-ui';
import { formatBalance } from 'utils';
import { useFormContext } from 'react-hook-form';
import { useRepayFormData } from 'features/adjustment/repay/repay-form-context';

export const Balance = () => {
  const { watch } = useFormContext();
  const {
    stEthBalance,
    wstEthBalance,
    isStEthLoading,
    isWstEthLoading,
    isStEthError,
    isWstEthError,
  } = useRepayFormData();
  const token = watch('token');
  const isLoading = isStEthLoading || isWstEthLoading;
  const isError = isStEthError || isWstEthError;
  const balance = token === 'stETH' ? stEthBalance : wstEthBalance;

  return (
    <Wrapper>
      <InfoRow>
        <span>Available to repay</span>
        {isLoading && <Loader size="small" />}
        {!isLoading && !isError && balance !== undefined && (
          <AmountInfo>
            {formatBalance(balance).trimmed} {token}
          </AmountInfo>
        )}
        {isError && !isLoading && (
          <AmountInfo>stEth amount is not available</AmountInfo>
        )}
      </InfoRow>
    </Wrapper>
  );
};
