import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useFormState } from 'react-hook-form';

export const SubmitButton = () => {
  const { isSubmitting, disabled } = useFormState();

  const isDisabled = isSubmitting && disabled;

  return (
    <PermissionedSubmitButton dashboardRole={'minter'} disabled={isDisabled}>
      Mint
    </PermissionedSubmitButton>
  );
};
