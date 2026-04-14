import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { useDappStatus } from 'modules/web3';
import {
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
} from 'modules/vaults';
import { useDisableForm } from 'shared/hook-form';

export const useShowTableMenu = () => {
  const { address, isDappActive } = useDappStatus();
  const disabled = useDisableForm();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('validatorWithdrawalTrigger');
  const { activeVault, queryKeys } = useVault();

  const { data: depositor } = useQuery({
    queryKey: [...queryKeys.base, 'nodeOperatorDepositor', address],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useShowTableMenu] active vault is not defined');

      const pdgContract = activeVault.predepositGuarantee;
      return await pdgContract.read.nodeOperatorDepositor([
        activeVault.nodeOperator,
      ]);
    },
  });

  const isDepositor = !!address && !!depositor && depositor === address;

  return {
    isAdmin: hasAdmin,
    hasWithdrawalPermission: hasPermission,
    isDepositor: isDepositor,
    hideTableMenu:
      disabled || !isDappActive || !(hasAdmin || hasPermission || isDepositor),
  };
};
