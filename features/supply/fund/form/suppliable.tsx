import { useFormState, useWatch } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';

import { useFundForm } from './fund-form-provider';
import type { FundFormValidatedValues } from './types';

import { InfoRowAmount } from 'shared/components/form';

export const Suppliable = () => {
  const { token } = useWatch<FundFormValidatedValues>();
  const { disabled } = useFormState();
  const { data, isPending } = useFundForm().balanceQuery;

  return (
    <InfoRowAmount
      title={vaultTexts.actions.supply.available}
      amount={data}
      loading={isPending}
      token={token}
      disabled={disabled}
    />
  );
};
