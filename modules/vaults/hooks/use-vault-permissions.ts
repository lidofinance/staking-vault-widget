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
  // TODO: multicall/useReadContracts
  const roleAdmin = useVaultPermissions('defaultAdmin');
  const roleNOM = useVaultPermissions('nodeOperatorManager');

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
