import { useQuery } from '@tanstack/react-query';

import {
  readWithReport,
  useReadDashboard,
  useValidateRecipientArgs,
  useVault,
} from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import invariant from 'tiny-invariant';

export const useClaimData = () => {
  const { invalidateVaultState, activeVault, queryKeys } = useVault();
  const { publicClient } = useLidoSDK();
  const validationContext = useAwaiter(useValidateRecipientArgs()).awaiter;

  const recipientQuery = useReadDashboard({
    functionName: 'feeRecipient',
  });

  const claimableFeeQuery = useQuery({
    queryKey: [...queryKeys.state, 'accruedFee'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, 'Active vault is not defined');

      const [noFee, withdrawableValue] = await readWithReport({
        report: activeVault.report,
        publicClient,
        contracts: [
          activeVault.dashboard.prepare.accruedFee(),
          activeVault.hub.prepare.withdrawableValue([activeVault.address]),
        ] as const,
      });

      return {
        noFee,
        withdrawableValue,
        isEnoughToClaim: withdrawableValue >= noFee,
      };
    },
  });

  return {
    recipientQuery,
    claimableFeeQuery,
    validationContext,
    invalidateClaimData: invalidateVaultState,
  };
};
