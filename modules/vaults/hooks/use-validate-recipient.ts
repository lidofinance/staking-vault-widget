import { useMemo } from 'react';
import { useVault } from '../vault-context';
import { ValidateRecipientArgs } from 'utils/validate-form-value';

export const useValidateRecipientArgs = ():
  | ValidateRecipientArgs
  | undefined => {
  const { activeVault } = useVault();

  return useMemo(() => {
    if (!activeVault) return undefined;
    return {
      vaultAddress: activeVault.address,
      dashboardAddress: activeVault.dashboard.address,
    };
  }, [activeVault]);
};
