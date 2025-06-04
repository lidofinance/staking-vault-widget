import { useFormState } from 'react-hook-form';
import { useClaimFormData } from 'features/claim/claim-form/claim-form-context';
import { formatBalance } from 'utils';
import { PermissionedSubmitButton } from 'modules/vaults/components';

export const SubmitButton = () => {
  const { isValid, isSubmitting, disabled } = useFormState();
  const { isLoadingClaimInfo, availableToClaim, isErrorClaimInfo } =
    useClaimFormData();

  const isLoading =
    (!isErrorClaimInfo && !availableToClaim) || isLoadingClaimInfo;

  const isDisabled = isSubmitting || !isValid || disabled || isLoading;

  return (
    <PermissionedSubmitButton
      dashboardRole="nodeOperatorFeeClaimer"
      type="submit"
      disabled={isDisabled}
    >
      {isLoading && <>Wait for claim information</>}
      {!!availableToClaim && <>{formatBalance(availableToClaim).trimmed} ETH</>}
    </PermissionedSubmitButton>
  );
};
