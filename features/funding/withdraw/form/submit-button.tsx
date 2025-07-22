import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, PermissionedSubmitButton } from 'modules/vaults';

import type { WithdrawFormFieldValues } from './types';

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();
  const [amount, token] = useFormContext<WithdrawFormFieldValues>().watch([
    'amount',
    'token',
  ]);

  const isDisabled = isSubmitting || disabled;

  return (
    <PermissionedSubmitButton
      loading={isSubmitting}
      dashboardRole="withdrawer"
      disabled={isDisabled}
    >
      {vaultTexts.actions.withdraw.submit(token, amount)}
    </PermissionedSubmitButton>
  );
};
