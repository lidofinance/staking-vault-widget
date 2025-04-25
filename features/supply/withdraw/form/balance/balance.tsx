import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { useWithdrawFormData } from 'features/supply/withdraw/withdraw-form-context';
import { formatBalance } from 'utils';

export const Balance = () => {
  const {
    withdrawableAmount,
    isWithdrawableLoading,
    isWithdrawableSuccess,
    isWithdrawableError,
  } = useWithdrawFormData();

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to withdraw
        </Text>
        {isWithdrawableLoading && <Loader size="small" />}
        {isWithdrawableSuccess && !isWithdrawableLoading && (
          <AmountInfo>
            {formatBalance(withdrawableAmount).trimmed} ETH
          </AmountInfo>
        )}
        {isWithdrawableError && !isWithdrawableLoading && (
          <AmountInfo>Balance is not available</AmountInfo>
        )}
      </InfoRow>
    </Wrapper>
  );
};
