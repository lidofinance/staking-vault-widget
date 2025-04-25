import { useMemo } from 'react';
import { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { useVaultInfo } from 'features/overview/contexts';
import { dashboardAbi } from 'abi/dashboard-abi';
import { PermissionAccounts } from '../types';
import { EDITABLE_ROLES_LIST, EDITABLE_ROLES_MAP } from '../consts';

export const useVaultPermissionsRoles = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  const { data: result, ...rest } = useReadContracts({
    query: {
      enabled: !!owner,
    },

    contracts: EDITABLE_ROLES_LIST.map((key) => ({
      abi: dashboardAbi,
      address: owner,
      functionName: 'getRoleMembers',
      args: [EDITABLE_ROLES_MAP[key]],
    })),
  });

  const data = useMemo(() => {
    if (result && result.length > 0) {
      return result.map((item, index) => {
        if (item.status === 'success') {
          return {
            permissionName: EDITABLE_ROLES_LIST[index],
            addressList: item.result as Address[],
          };
        }
      }) as PermissionAccounts[];
    }

    return [];
  }, [result]);

  return { data, ...rest };
};
