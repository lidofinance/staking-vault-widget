import { useBalance } from 'wagmi';
import { useDappStatus } from 'modules/web3';

import { Text, Loader } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { formatBalance } from 'utils';

export const Balance = () => {
  const { address } = useDappStatus();
  const { data, isLoading, isSuccess, isError } = useBalance({
    address,
  });

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to Supply
        </Text>
        {isLoading && <Loader size="small" />}
        {isSuccess && !isLoading && (
          <AmountInfo>{formatBalance(data.value).trimmed} ETH</AmountInfo>
        )}
        {isError && !isLoading && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
