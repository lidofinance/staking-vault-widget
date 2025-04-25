import { useAccount, useReadContract } from 'wagmi';
import { useVaultInfo } from 'features/overview/contexts';
import { VAULTS_ALL_ROLES_MAP } from '../consts';
import { dashboardAbi } from 'abi/dashboard-abi';

import type { Address, Hash } from 'viem';

export type DashboardRoles = keyof typeof VAULTS_ALL_ROLES_MAP;

export const useVaultPermissions = (role?: DashboardRoles) => {
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

export const useVaultConfirmingRoles = () => {
  // TODO: multicall/ useReadContracts
  const role1 = useVaultPermissions('defaultAdmin');
  const role2 = useVaultPermissions('nodeOperatorManager');

  const hasAtLeastOne = role1.hasPermission || role2.hasPermission;
  return {
    hasConfirmingRole: hasAtLeastOne,
    hasAdmin: role1.hasPermission,
    hasNodeOperatporManager: role2.hasPermission,
    hasBothConfirmingRoles: role1.hasPermission && role2.hasPermission,
    isLoading: !hasAtLeastOne && (role1.isLoading || role2.isLoading),
    error: role1.error || role2.error,
  };
};
