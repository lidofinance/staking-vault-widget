import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';

import { useFundForm } from './fund-form-provider';
import type { FundFormValidatedValues } from './types';

export const TxInfo = () => {
  const { watch } = useFormContext<FundFormValidatedValues>();
  const { data: maxMintableSteth, isLoading } =
    useFundForm().maxMintableStethQuery;
  const mintSteth = watch('mintSteth');

  if (!mintSteth) return null;

  return (
    <InfoRowAmount
      label="You will receive"
      amount={maxMintableSteth}
      tokenSymbol="stETH"
      isLoading={isLoading}
      noDataLabel="-"
    />
  );
};
