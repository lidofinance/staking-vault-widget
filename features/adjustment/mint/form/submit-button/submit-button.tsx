import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, PermissionedSubmitButton } from 'modules/vaults';

import type { MintFormFieldValues } from '../types';

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();
  const [amount, token] = useFormContext<MintFormFieldValues>().watch([
    'amount',
    'token',
  ]);

  const isDisabled = isSubmitting && disabled;

  return (
    <PermissionedSubmitButton dashboardRole={'minter'} disabled={isDisabled}>
      {vaultTexts.actions.mint.submit(token, amount)}
    </PermissionedSubmitButton>
  );
};
