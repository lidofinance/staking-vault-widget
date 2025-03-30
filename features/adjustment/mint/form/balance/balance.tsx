import { useBalance } from 'wagmi';
import { useDappStatus } from 'modules/web3';

import { Text, Loader } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';
import { formatBalance } from '../../../../../utils';

export const Balance = () => {
  // todo use wallet account
  const { address } = useDappStatus();
  const { data, isLoading, isSuccess, isError } = useBalance({
    address,
  });

  // TODO: replace by calculating available stEth to mint
  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to mint
        </Text>
        {isLoading && <Loader size="small" />}
        {isSuccess && (
          <AmountInfo>{formatBalance(data.value).trimmed}</AmountInfo>
        )}
        {isError && <AmountInfo>stEth amount is not available</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
