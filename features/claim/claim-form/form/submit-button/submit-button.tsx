import { Button } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';
import { useClaimFormData } from 'features/claim/claim-form/claim-form-context';
import { formatBalance } from 'utils';

export const SubmitButton = () => {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();
  const { isLoadingClaimInfo, availableToClaim, isErrorClaimInfo } =
    useClaimFormData();

  const isLoading =
    (!isErrorClaimInfo && !availableToClaim) || isLoadingClaimInfo;

  return (
    <Button type="submit" disabled={isSubmitting || !isValid || isLoading}>
      {isLoading && <>Wait for claim information</>}
      {!!availableToClaim && <>{formatBalance(availableToClaim).trimmed} ETH</>}
    </Button>
  );
};
