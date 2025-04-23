import { useFormContext } from 'react-hook-form';
import { useClaimFormData } from 'features/claim/claim-form/claim-form-context';
import { formatBalance } from 'utils';
import { PermissionedSubmitButton } from 'modules/vaults/components';

export const SubmitButton = () => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();
  const { isLoadingClaimInfo, availableToClaim, isErrorClaimInfo } =
    useClaimFormData();

  const isLoading =
    (!isErrorClaimInfo && !availableToClaim) || isLoadingClaimInfo;

  return (
    <PermissionedSubmitButton
      dashboardRole="nodeOperatorFeeClaimer"
      type="submit"
      disabled={isSubmitting || !isValid || isLoading}
    >
      {isLoading && <>Wait for claim information</>}
      {!!availableToClaim && <>{formatBalance(availableToClaim).trimmed} ETH</>}
    </PermissionedSubmitButton>
  );
};
