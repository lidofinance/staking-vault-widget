import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { useVaultInfo } from 'modules/vaults';
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

export const useVaultPermissions = (roles: VAULTS_ALL_ROLES[]) => {
  const { activeVault } = useVaultInfo();
  const { address } = useAccount();

  const contracts = useMemo(
    () =>
      roles.map((role) => {
        const roleHash = VAULTS_ALL_ROLES_MAP[role];
        return {
          abi: dashboardAbi,
          address: activeVault?.owner as Address,
          functionName: 'hasRole' as const,
          args: [roleHash, address] as [Hash, Address],
        };
      }),
    [activeVault?.owner, address, roles],
  );

  return useReadContracts({
    contracts,
    allowFailure: false,
    batchSize: 3,
    query: {
      select: (data) => {
        const result = data.map((item, index) => ({
          role: roles[index],
          hasRole: !!item,
        }));
        return {
          result,
          hasPermissions: result.every((item) => item.hasRole),
          missingRoles: result
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
    hasNodeOperatporManager: roleNOM.hasPermission,
    hasBothConfirmingRoles: roleAdmin.hasPermission && roleNOM.hasPermission,
    isLoading: !hasAtLeastOne && (roleAdmin.isLoading || roleNOM.isLoading),
    error: roleAdmin.error || roleNOM.error,
  };
};
