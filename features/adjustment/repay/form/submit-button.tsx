import { useFormState } from 'react-hook-form';

import { PermissionedSubmitButton } from 'modules/vaults/components';

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();
  const isDisabled = isSubmitting || disabled;

  return (
    <PermissionedSubmitButton
      dashboardRole="repayer"
      type="submit"
      disabled={isDisabled}
    >
      Repay
    </PermissionedSubmitButton>
  );
};
