import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import { WarningMessage } from 'shared/components/warning-message';

import { useWithdrawFormData } from './withdraw-form-context';
import type { WithdrawFormFieldValues } from './types';

// Resume after a confirmed withdraw (the wrap failed): the same values send only the wrap.
// Changing any value starts a new withdraw, and the notice disappears.
export const WithdrawResumeWarning = () => {
  const { isWithdrawn } = useWithdrawFormData();
  const amount = useFormContext<WithdrawFormFieldValues>().watch('amount');

  if (!isWithdrawn) return null;

  return (
    <WarningMessage data-testid="withdrawForm-alreadyWithdrawn">
      {vaultTexts.actions.withdraw.alreadyWithdrawn(amount)}
    </WarningMessage>
  );
};
