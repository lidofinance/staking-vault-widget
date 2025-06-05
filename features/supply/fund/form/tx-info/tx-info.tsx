import { useFormContext } from 'react-hook-form';
import { Loader, Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { useFundForm } from '../fund-form-provider';
import type { FundFormValidatedValues } from '../types';

import { Wrapper, InfoRow } from './styles';

export const TxInfo = () => {
  const { watch } = useFormContext<FundFormValidatedValues>();
  const {
    data: maxMintableSteth,
    isLoading,
    isError,
  } = useFundForm().maxMintableStethQuery;
  const mintSteth = watch('mintSteth');

  const isEmpty = isError;

  return (
    <Wrapper>
      {mintSteth && (
        <InfoRow>
          <Text size="xxs" color="secondary">
            You will receive
          </Text>
          {isLoading && <Loader size="small" />}
          {typeof maxMintableSteth === 'bigint' && (
            <FormatToken amount={maxMintableSteth} symbol="stETH" />
          )}
          {isEmpty && '-'}
        </InfoRow>
      )}
    </Wrapper>
  );
};
