import { useWatch } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';

import { useFundForm } from './fund-form-provider';
import type { FundFormValidatedValues } from './types';

import { InfoRowAmount } from 'shared/components/form';

export const Balance = () => {
  const { token } = useWatch<FundFormValidatedValues>();
  const { data, isLoading } = useFundForm().balanceQuery;

  return (
    <InfoRowAmount
      label={vaultTexts.actions.supply.available}
      amount={data}
      isLoading={isLoading}
      token={token}
    />
  );
};
