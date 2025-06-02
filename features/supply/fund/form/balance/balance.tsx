import { useWatch } from 'react-hook-form';
import { Text, Loader } from '@lidofinance/lido-ui';

import { formatBalance } from 'utils';
import { vaultTexts } from 'modules/vaults';

import { useFundForm } from '../fund-form-provider';
import type { FundFormSchemaType } from '../types';

import { AmountInfo, InfoRow, Wrapper } from './styles';

export const Balance = () => {
  const { token } = useWatch<FundFormSchemaType>();
  const { data, isLoading, isSuccess, isError } = useFundForm().balanceQuery;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          {vaultTexts.actions.supply.available}
        </Text>
        {isLoading && <Loader size="small" />}
        {isSuccess && !isLoading && (
          <AmountInfo>
            {formatBalance(data).trimmed} {token}
          </AmountInfo>
        )}
        {isError && !isLoading && <AmountInfo>-</AmountInfo>}
      </InfoRow>
    </Wrapper>
  );
};
