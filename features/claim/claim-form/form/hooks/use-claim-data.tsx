import { useReadContract } from 'wagmi';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useValidateRecipientArgs, useVaultInfo } from 'modules/vaults';
import { useCallback } from 'react';
import { useAwaiter } from 'shared/hooks/use-awaiter';

export const useClaimData = () => {
  const { activeVault } = useVaultInfo();
  const validationContext = useAwaiter(useValidateRecipientArgs()).awaiter;

  const recipientQuery = useReadContract({
    abi: dashboardAbi,
    address: activeVault?.dashboard.address,
    functionName: 'nodeOperatorFeeRecipient',
    query: {
      enabled: !!activeVault?.owner,
    },
  });

  const claimableFeeQuery = useReadContract({
    abi: dashboardAbi,
    address: activeVault?.owner,
    functionName: 'nodeOperatorDisbursableFee',
    query: {
      enabled: !!activeVault?.owner,
    },
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
