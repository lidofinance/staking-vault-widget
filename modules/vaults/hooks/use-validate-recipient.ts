import { useMemo } from 'react';
import { useVaultInfo } from '../vault-context';
import { ValidateRecipientArgs } from 'utils/validate-form-value';

export const useValidateRecipientArgs = ():
  | ValidateRecipientArgs
  | undefined => {
  const { activeVault } = useVaultInfo();

  return useMemo(() => {
    if (!activeVault) return undefined;
    return {
      vaultAddress: activeVault?.address,
      dashboardAddress: activeVault?.owner,
    };
  }, [activeVault]);
};
