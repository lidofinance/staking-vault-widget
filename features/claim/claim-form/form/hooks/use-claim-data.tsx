import {
  useReadDashboard,
  useValidateRecipientArgs,
  useVault,
} from 'modules/vaults';
import { useAwaiter } from 'shared/hooks/use-awaiter';

export const useClaimData = () => {
  const { invalidateVaultState } = useVault();
  const validationContext = useAwaiter(useValidateRecipientArgs()).awaiter;

  const recipientQuery = useReadDashboard({
    functionName: 'nodeOperatorFeeRecipient',
  });

  const claimableFeeQuery = useReadDashboard({
    functionName: 'nodeOperatorDisbursableFee',
    applyReport: true,
  });

  return {
    recipientQuery,
    claimableFeeQuery,
    validationContext,
    invalidateClaimData: invalidateVaultState,
  };
};
