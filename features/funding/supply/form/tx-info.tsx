import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

import { useSupplyForm } from './supply-form-provider';
import type { SupplyFormValidatedValues } from './types';

export const TxInfo = () => {
  const { watch } = useFormContext<SupplyFormValidatedValues>();
  const { data, isLoading } = useSupplyForm().maxMintableStethQuery;
  const mintSteth = watch('mintSteth');

  if (!mintSteth) return null;

  return (
    <InfoRowAmount
      title={vaultTexts.common.form.willReceiveLabel}
      amount={data?.maxMintableStETH}
      token="stETH"
      loading={isLoading}
      noDataLabel="-"
      data-testid="youWillReceiveRow"
    />
  );
};
