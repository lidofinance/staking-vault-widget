import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useFormState } from 'react-hook-form';

export const SubmitButton = () => {
  const { isSubmitting, isValid, disabled } = useFormState();
  const isDisabled = isSubmitting || !isValid || disabled;

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
