import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { useClaimFormData } from 'features/claim/claim-form/claim-form-context';
import { formatBalance } from 'utils';

export const Balance = () => {
  const { isLoadingClaimInfo, availableToClaim, isErrorClaimInfo } =
    useClaimFormData();

  const isAvailableToClaim = typeof availableToClaim === 'bigint';
  const isLoading =
    (!isErrorClaimInfo && !isAvailableToClaim) || isLoadingClaimInfo;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to claim
        </Text>
        {isLoading && <Loader size="small" />}
        {isAvailableToClaim && (
          <AmountInfo>{formatBalance(availableToClaim).trimmed} ETH</AmountInfo>
        )}
      </InfoRow>
    </Wrapper>
  );
};
