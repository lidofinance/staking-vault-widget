import { useReadContract } from 'wagmi';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useValidateRecipientArgs, useVaultInfo } from 'modules/vaults';
import { useCallback } from 'react';
import { useAwaiter } from 'shared/hooks/use-awaiter';

export const useClaimData = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const validationContext = useAwaiter(useValidateRecipientArgs()).awaiter;

  const claimableFeeQuery = useReadContract({
    abi: dashboardAbi,
    address: activeVault?.owner,
    functionName: 'nodeOperatorUnclaimedFee',
    query: {
      enabled: !!activeVault?.owner,
    },
  });

  const invalidateClaimData = useCallback(
    () =>
      Promise.all([
        refetchVaultInfo(),
        claimableFeeQuery.refetch({ cancelRefetch: true, throwOnError: false }),
      ]),
    [claimableFeeQuery, refetchVaultInfo],
  );

  return {
    claimableFeeQuery,
    validationContext,
    invalidateClaimData,
  };
};
