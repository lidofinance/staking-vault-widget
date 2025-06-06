import { Loader, Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { useWithdrawFormData } from 'features/supply/withdraw/form/withdraw-form-context';

import { FormatToken } from 'shared/formatters';

export const Withdrawable = () => {
  const { withdrawableEtherQuery } = useWithdrawFormData();
  const { data, isLoading } = withdrawableEtherQuery;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to withdraw
        </Text>
        <AmountInfo>
          {isLoading ? (
            <Loader size="small" />
          ) : (
            <FormatToken amount={data} symbol="ETH" />
          )}
        </AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
