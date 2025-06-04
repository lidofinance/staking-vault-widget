import { PermissionedSubmitButton } from 'modules/vaults/components';

import { useFormState } from 'react-hook-form';

export const SubmitButton = () => {
  const { isValid, isSubmitting, isDirty } = useFormState();
  const disabled = isSubmitting || !isValid || !isDirty;

  const isDisabled = isSubmitting || !isValid || !isDirty || disabled;

  return (
    <PermissionedSubmitButton
      type="submit"
      dashboardRole="withdrawer"
      disabled={isDisabled}
    >
      Withdraw
    </PermissionedSubmitButton>
  );
};
