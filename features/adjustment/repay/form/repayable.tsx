import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import { InfoRowAmount } from 'shared/components/form';

import { useRepayForm } from './repay-form-context';
import type { RepayFormFieldValues } from './types';

export const Repayable = () => {
  const { watch } = useFormContext<RepayFormFieldValues>();
  const { isMaxRepayableLoading, maxRepayable } = useRepayForm();
  const token = watch('token');

  return (
    <InfoRowAmount
      title={vaultTexts.actions.repay.available}
      amount={maxRepayable}
      token={token}
      loading={isMaxRepayableLoading}
    />
  );
};
