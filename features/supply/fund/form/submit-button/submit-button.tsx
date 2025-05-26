import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useFormState } from 'react-hook-form';

export const SubmitButton = () => {
  const { isSubmitting, isValid, isDirty, disabled } = useFormState();

  const isDisabled = isSubmitting || !isValid || !isDirty || disabled;

  return (
    <PermissionedSubmitButton
      dashboardRole="supplier"
      type="submit"
      disabled={isDisabled}
    >
      Supply
    </PermissionedSubmitButton>
  );
};
