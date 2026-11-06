import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, PermissionedSubmitButton } from 'modules/vaults';

import type { WithdrawFormFieldValues } from './types';
import { useWithdrawFormData } from './withdraw-form-context';

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();
  const [amount, token] = useFormContext<WithdrawFormFieldValues>().watch([
    'amount',
    'token',
  ]);

  const { isWithdrawn } = useWithdrawFormData();
  const isDisabled = isSubmitting || disabled;

  return (
    <PermissionedSubmitButton
      loading={isSubmitting}
      dashboardRole="withdrawer"
      disabled={isDisabled}
    >
      {/* the button names what will be sent: after a confirmed withdraw only the wrap is left */}
      {isWithdrawn
        ? vaultTexts.actions.withdraw.wrapOnly(amount)
        : vaultTexts.actions.withdraw.submit(token, amount)}
    </PermissionedSubmitButton>
  );
};
