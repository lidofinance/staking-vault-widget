import { useReadContract } from 'wagmi';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'modules/vaults';
import { useCallback } from 'react';

export const useClaimData = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();

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
    invalidateClaimData,
  };
};
