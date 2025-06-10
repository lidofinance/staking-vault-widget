import { useFormState } from 'react-hook-form';

import { PermissionedSubmitButton } from 'modules/vaults/components';
import { useClaimForm } from './claim-form-context';
import { vaultTexts } from 'modules/vaults';

export const SubmitButton = () => {
  const { claimableFeeQuery } = useClaimForm();
  const { isSubmitting, disabled } = useFormState();

  const isDisabled =
    isSubmitting ||
    disabled ||
    claimableFeeQuery.isLoading ||
    !claimableFeeQuery.data;

  return (
    <PermissionedSubmitButton
      dashboardRole="nodeOperatorFeeClaimer"
      type="submit"
      disabled={isDisabled}
    >
      {vaultTexts.actions.claim.claimButton(claimableFeeQuery.data)}
    </PermissionedSubmitButton>
  );
};
