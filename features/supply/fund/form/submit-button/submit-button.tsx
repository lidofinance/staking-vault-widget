import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isSubmitting, isValid, isDirty },
  } = useFormContext();
  return (
    <PermissionedSubmitButton
      dashboardRole="funder"
      type="submit"
      disabled={isSubmitting || !isValid || !isDirty}
    >
      Supply
    </PermissionedSubmitButton>
  );
};
