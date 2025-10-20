import { useFormState, useWatch } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';

import { useSupplyForm } from './supply-form-provider';
import type { SupplyFormValidatedValues } from './types';

import { InfoRowAmount } from 'shared/components/form';

export const Suppliable = () => {
  const { token } = useWatch<SupplyFormValidatedValues>();
  const { disabled } = useFormState();
  const { data, isLoading } = useSupplyForm().balanceQuery;

  return (
    <InfoRowAmount
      title={vaultTexts.actions.supply.available}
      amount={data}
      loading={isLoading}
      token={token}
      disabled={disabled}
      data-testid="availableToSupplyRow"
    />
  );
};
