import { useVaultPermissions, VAULTS_ALL_ROLES } from 'modules/vaults';
import { useMemo } from 'react';
import { useVaultSettingsData } from './use-main-settings-data';

const roles = [
  'depositsPauser',
  'depositsResumer',
] as readonly VAULTS_ALL_ROLES[];

export const useDepositorRolesPermissions = () => {
  const { data: permissionsData } = useVaultPermissions(roles);
  const { data: vaultSettingsData } = useVaultSettingsData();

  return useMemo(() => {
    if (!permissionsData || !vaultSettingsData)
      return { showForPauserRole: false, showForResumerRole: false };

    const { isDepositAllowed } = vaultSettingsData;
    const { missingRoles } = permissionsData;
    const [hasDepositsPauserRole, hasDepositsResumer] = roles.map(
      (role) => !missingRoles.includes(role),
    );
    return {
      showForPauserRole: hasDepositsPauserRole && isDepositAllowed,
      showForResumerRole: hasDepositsResumer && !isDepositAllowed,
    };
  }, [permissionsData, vaultSettingsData]);
};
