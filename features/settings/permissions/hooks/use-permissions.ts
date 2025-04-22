import { useReadContracts } from 'wagmi';
import { PERMISSION, permissions } from 'consts/roles';
import { useVaultInfo } from 'features/overview/contexts';
import { DelegationAbi } from 'abi/delegation';

export const useVaultPermissionsRoles = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const permissionsKeys = Object.keys(permissions) as PERMISSION[];

  return useReadContracts({
    query: {
      enabled: !!owner,
    },
    contracts: permissionsKeys.map((key) => ({
      abi: DelegationAbi,
      address: owner,
      functionName: 'getRoleMembers',
      args: [permissions[key]],
    })),
  });
};
