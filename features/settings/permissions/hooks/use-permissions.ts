import { useMemo } from 'react';
import { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { permissions, permissionsKeys } from 'consts/roles';
import { useVaultInfo } from 'features/overview/contexts';
import { DelegationAbi } from 'abi/delegation';
import { PermissionAccounts } from '../types';

export const useVaultPermissionsRoles = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  const { data: result, ...rest } = useReadContracts({
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

  const data = useMemo(() => {
    if (result && result.length > 0) {
      return result.map((item, index) => {
        if (item.status === 'success') {
          return {
            permissionName: permissionsKeys[index],
            addressList: item.result as Address[],
          };
        }
      }) as PermissionAccounts[];
    }

    return [];
  }, [result]);

  return { data, ...rest };
};
