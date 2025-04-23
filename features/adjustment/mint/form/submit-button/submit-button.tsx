import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext();
  const disabled = isSubmitting && !isValid;

  return (
    <PermissionedSubmitButton
      dashboardRole="minter"
      type="submit"
      disabled={disabled}
    >
      Mint
    </PermissionedSubmitButton>
  );
};
