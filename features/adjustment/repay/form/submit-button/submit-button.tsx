import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <PermissionedSubmitButton
      dashboardRole="burner"
      type="submit"
      disabled={disabled}
    >
      Repay
    </PermissionedSubmitButton>
  );
};
