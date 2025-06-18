import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import {
  NO_MANAGER_PERMISSION_LIST,
  useVaultInfo,
  VAULT_MANAGER_PERMISSIONS_LIST,
} from 'modules/vaults';
import { VAULTS_ALL_ROLES, VAULTS_ALL_ROLES_MAP } from '../consts';
import { dashboardAbi } from 'abi/dashboard-abi';

import type { Address, Hash } from 'viem';
import { useMemo } from 'react';

export const useVaultPermission = (role?: VAULTS_ALL_ROLES) => {
  const { activeVault } = useVaultInfo();
  const { address } = useAccount();

  const roleHash = role && VAULTS_ALL_ROLES_MAP[role];

  const query = useReadContract({
    abi: dashboardAbi,
    address: activeVault?.owner as Address,
    functionName: 'hasRole',
    args: [roleHash, address] as [Hash, Address],

    query: {
      enabled: !!(activeVault?.owner && roleHash && address),
    },
  });

  return {
    hasPermission: !!query.data,
    ...query,
  };
};

const saturatePermissions = (
  roles: readonly VAULTS_ALL_ROLES[],
): readonly VAULTS_ALL_ROLES[] => {
  const adminsList = new Set(VAULT_MANAGER_PERMISSIONS_LIST);
  const noList = new Set(NO_MANAGER_PERMISSION_LIST);
  const saturateRoles: VAULTS_ALL_ROLES[] = [...roles];

  // @ts-expect-error list types
  const hasAdminsPermissions = roles.some((role) => adminsList.has(role));
  // @ts-expect-error list types
  const hasNoPermissions = roles.some((role) => noList.has(role));

  if (hasAdminsPermissions && !roles.includes('defaultAdmin')) {
    saturateRoles.push('defaultAdmin');
  }

  if (hasNoPermissions && !roles.includes('nodeOperatorManager')) {
    saturateRoles.push('nodeOperatorManager');
  }

  return saturateRoles;
};

export const useVaultPermissions = (roles: readonly VAULTS_ALL_ROLES[]) => {
  const { activeVault } = useVaultInfo();
  const { address } = useAccount();

  const saturatedRoles = saturatePermissions(roles);

  const contracts = useMemo(
    () =>
      saturatedRoles.map((role) => {
        const roleHash = VAULTS_ALL_ROLES_MAP[role];
        return {
          abi: dashboardAbi,
          address: activeVault?.owner as Address,
          functionName: 'hasRole' as const,
          args: [roleHash, address] as [Hash, Address],
        };
      }),
    [activeVault?.owner, address, saturatedRoles],
  );

  return useReadContracts({
    contracts,
    allowFailure: false,
    batchSize: 3,
    query: {
      select: (data) => {
        const rolesResult = data.map((item, index) => ({
          role: saturatedRoles[index],
          hasRole: !!item,
        }));

        return {
          result: rolesResult,
          hasPermissions: rolesResult.some((item) => item.hasRole),
          hasDefaultAdminsPermissions: false,
          hasNodeOperatorPermissions: false,
          missingRoles: rolesResult
            .filter((item) => !item.hasRole)
            .map((item) => item.role),
        };
      },
    },
  });
};

export const useVaultConfirmingRoles = () => {
  // TODO: multicall/useReadContracts
  const roleAdmin = useVaultPermission('defaultAdmin');
  const roleNOM = useVaultPermission('nodeOperatorManager');

  const hasAtLeastOne = roleAdmin.hasPermission || roleNOM.hasPermission;
  return {
    hasConfirmingRole: hasAtLeastOne,
    hasAdmin: roleAdmin.hasPermission,
    hasNodeOperatorManager: roleNOM.hasPermission,
    hasBothConfirmingRoles: roleAdmin.hasPermission && roleNOM.hasPermission,
    isLoading: !hasAtLeastOne && (roleAdmin.isLoading || roleNOM.isLoading),
    error: roleAdmin.error || roleNOM.error,
  };
};
