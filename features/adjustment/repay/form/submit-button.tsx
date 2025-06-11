import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, PermissionedSubmitButton } from 'modules/vaults';

import type { RepayFormFieldValues } from './types';

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();
  const [amount, token] = useFormContext<RepayFormFieldValues>().watch([
    'amount',
    'token',
  ]);
  const isDisabled = isSubmitting || disabled;

  return (
    <PermissionedSubmitButton
      dashboardRole="repayer"
      type="submit"
      disabled={isDisabled}
    >
      {vaultTexts.actions.repay.submit(token, amount)}
    </PermissionedSubmitButton>
  );
};
