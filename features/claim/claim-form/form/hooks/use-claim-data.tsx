import { useReadDashboard, useValidateRecipientArgs } from 'modules/vaults';
import { useCallback } from 'react';
import { useAwaiter } from 'shared/hooks/use-awaiter';

export const useClaimData = () => {
  const validationContext = useAwaiter(useValidateRecipientArgs()).awaiter;

  const recipientQuery = useReadDashboard({
    functionName: 'nodeOperatorFeeRecipient',
  });

  const claimableFeeQuery = useReadDashboard({
    functionName: 'nodeOperatorDisbursableFee',
    applyReport: true,
  });

  const invalidateClaimData = useCallback(
    () =>
      claimableFeeQuery.refetch({ cancelRefetch: true, throwOnError: false }),

    [claimableFeeQuery],
  );

  return {
    recipientQuery,
    claimableFeeQuery,
    validationContext,
    invalidateClaimData,
  };
};
