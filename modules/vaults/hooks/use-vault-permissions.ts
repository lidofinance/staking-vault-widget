import { useAccount, useReadContracts } from 'wagmi';
import { useVaultInfo } from 'modules/vaults';
import {
  VAULTS_ALL_ROLES,
  VAULTS_ALL_ROLES_MAP,
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
} from '../consts';

import { useCallback, useMemo } from 'react';

// adds defaultAdmin and nodeOperatorManager roles to the list of roles
// if any roles are admined by them
// rolesOffset is used to track how many roles were added
const saturateRoles = (roles: readonly VAULTS_ALL_ROLES[]) => {
  let shouldFetchAdmin = false;
  let shouldFetchNOM = false;
  let rolesOffset = 0;

  const saturatedRoles = roles.map((role) => {
    const isAdminRole = role in VAULTS_OWNER_ROLES_MAP;
    const isNOMRole = role in VAULTS_NO_ROLES_MAP;
    shouldFetchAdmin ||= isAdminRole;
    shouldFetchNOM ||= isNOMRole;

    return {
      role,
      isAdminRole,
      isNOMRole,
    };
  });

  if (shouldFetchAdmin) {
    rolesOffset += 1;
    saturatedRoles.unshift({
      role: 'defaultAdmin',
      isAdminRole: false,
      isNOMRole: false,
    });
  }
  if (shouldFetchNOM) {
    rolesOffset += 1;
    saturatedRoles.unshift({
      role: 'nodeOperatorManager',
      isAdminRole: false,
      isNOMRole: false,
    });
  }

  return {
    saturatedRoles,
    rolesOffset,
  };
};

export const useVaultPermissions = (roles: readonly VAULTS_ALL_ROLES[]) => {
  const { activeVault } = useVaultInfo();
  const { address } = useAccount();

  const { contracts, rolesOffset, saturatedRoles } = useMemo(() => {
    const { saturatedRoles, rolesOffset } = saturateRoles(roles);

    return {
      rolesOffset,
      saturatedRoles,
      contracts:
        activeVault && address
          ? saturatedRoles.map(({ role }) => {
              const roleHash = VAULTS_ALL_ROLES_MAP[role];
              return activeVault.dashboard.prepare.hasRole([roleHash, address]);
            })
          : undefined,
    };
  }, [activeVault, address, roles]);

  // stabilized select function to avoid unnecessary re-renders
  const selectFn = useCallback(
    (queryData: boolean[]) => {
      const data = [...queryData];

      // Remove optional first service elements from array
      let isAdmin = false;
      let isNOM = false;
      if (rolesOffset > 0) {
        isAdmin = !!data.shift();
      }
      if (rolesOffset > 1) {
        isNOM = !!data.shift();
      }

      const rolesResult = data.map((item, index) => {
        const saturateRole = saturatedRoles[index + rolesOffset];
        isAdmin ||= saturateRole.role === 'defaultAdmin' && !!item;
        isNOM ||= saturateRole.role === 'nodeOperatorManager' && !!item;
        return {
          role: saturateRole.role,
          // user can have role if
          hasRole:
            // 1. roles is set directly
            !!item ||
            // 2. user is admin over this role
            (saturateRole.isAdminRole && isAdmin) ||
            (saturateRole.isNOMRole && isNOM),
        };
      });

      return {
        result: rolesResult,
        hasPermissions: rolesResult.every((item) => item.hasRole),
        hasDefaultAdminsPermissions: isAdmin,
        hasNodeOperatorPermissions: isNOM,
        missingRoles: rolesResult
          .filter((item) => !item.hasRole)
          .map((item) => item.role),
      };
    },
    [rolesOffset, saturatedRoles],
  );

  const query = useReadContracts({
    contracts,
    allowFailure: false,
    batchSize: 5,
    query: {
      select: selectFn,
      enabled: Boolean(activeVault?.owner && address && roles.length > 0),
    },
  });

  return {
    hasPermissions: query.data?.hasPermissions ?? false,
    ...query,
  };
};

export const useVaultPermission = (role?: VAULTS_ALL_ROLES) => {
  const query = useVaultPermissions(
    useMemo(() => (role ? [role] : []), [role]),
  );
  return {
    ...query,
    hasPermission: query.data?.hasPermissions ?? false,
  };
};

const adminRoles = ['defaultAdmin', 'nodeOperatorManager'] as const;

export const useVaultConfirmingRoles = () => {
  const { data, ...query } = useVaultPermissions(adminRoles);

  const hasAtLeastOne =
    data?.hasDefaultAdminsPermissions || data?.hasNodeOperatorPermissions;
  return {
    hasConfirmingRole: hasAtLeastOne,
    hasAdmin: data?.hasDefaultAdminsPermissions,
    hasNodeOperatorManager: data?.hasNodeOperatorPermissions,
    hasBothConfirmingRoles:
      data?.hasDefaultAdminsPermissions && data?.hasNodeOperatorPermissions,
    ...query,
  };
};
