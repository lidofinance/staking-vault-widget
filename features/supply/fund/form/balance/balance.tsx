import { useBalance } from 'wagmi';
import { useDappStatus } from 'modules/web3';

import { Text, Loader } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { formatBalance } from 'utils';

export const Balance = () => {
  const { address } = useDappStatus();
  const { data, isLoading, isFetching, isSuccess, isError } = useBalance({
    address,
  });
  const showLoader = isLoading || isFetching;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to Supply
        </Text>
        {showLoader && <Loader size="small" />}
        {isSuccess && !showLoader && (
          <AmountInfo>{formatBalance(data.value).trimmed} ETH</AmountInfo>
        )}
        {isError && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
