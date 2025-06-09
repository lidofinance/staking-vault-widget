import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

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
      label={vaultTexts.common.form.willReceiveLabel}
      amount={maxMintableSteth}
      token="stETH"
      isLoading={isLoading}
      noDataLabel="-"
    />
  );
};
