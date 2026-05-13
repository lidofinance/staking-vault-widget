import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, PermissionedSubmitButton } from 'modules/vaults';
import { useAntiScamBannerState } from 'shared/components';

import type { RepayFormFieldValues } from './types';

const { submit, repayUnavailable } = vaultTexts.actions.repay;

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();
  const [amount, token] = useFormContext<RepayFormFieldValues>().watch([
    'amount',
    'token',
  ]);
  const isDisabled = isSubmitting || disabled;
  const {
    isNotOwnerErrorVisible,
    isMultipleOwnersErrorVisible,
    isUnguaranteedDepositsErrorVisible,
  } = useAntiScamBannerState('repay');
  const isBlockedByRestrictions =
    isNotOwnerErrorVisible ||
    isMultipleOwnersErrorVisible ||
    isUnguaranteedDepositsErrorVisible;
  const variant = isBlockedByRestrictions ? 'translucent' : 'filled';
  const color = isBlockedByRestrictions ? 'secondary' : 'primary';
  const submitText = isBlockedByRestrictions
    ? repayUnavailable
    : submit(token, amount);

  return (
    <PermissionedSubmitButton
      loading={isSubmitting}
      dashboardRole="repayer"
      disabled={isDisabled}
      variant={variant}
      color={color}
    >
      {submitText}
    </PermissionedSubmitButton>
  );
};
