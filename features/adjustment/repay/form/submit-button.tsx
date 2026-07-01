import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, PermissionedSubmitButton } from 'modules/vaults';
import { useVerificationBannerDefender } from 'shared/components';

import type { RepayFormFieldValues } from './types';

const { submit, repayUnavailable } = vaultTexts.actions.repay;

export const SubmitButton = () => {
  const { isSubmitting, disabled, isValid } = useFormState();
  const [amount, token] = useFormContext<RepayFormFieldValues>().watch([
    'amount',
    'token',
  ]);
  const { isErrorBannerVisible, isWarningBannerVisible } =
    useVerificationBannerDefender('repay');

  const isDisabled =
    isSubmitting || disabled || (isWarningBannerVisible && !isValid);
  const variant = isErrorBannerVisible ? 'translucent' : 'filled';
  const color = isErrorBannerVisible ? 'secondary' : 'primary';
  const submitText = isErrorBannerVisible
    ? repayUnavailable
    : submit(token, amount);

  return (
    <PermissionedSubmitButton
      loading={isSubmitting}
      dashboardRole="repayer"
      disabled={isDisabled}
      variant={variant}
      color={color}
      data-testid="repayForm-submitButton"
    >
      {submitText}
    </PermissionedSubmitButton>
  );
};
