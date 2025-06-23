import { useQuery } from '@tanstack/react-query';
import { useVaultInfo, VAULTS_ROOT_ROLES_MAP } from 'modules/vaults';
import invariant from 'tiny-invariant';

export const UseVaultSettingsInfo = () => {
  const { activeVault } = useVaultInfo();
  return useQuery({
    queryKey: ['vault-settings-info', activeVault?.address],
    enabled: !!activeVault?.address,
    queryFn: async () => {
      invariant(activeVault, '[UseVaultSettingsInfo] activeVault is undefined');
      const [
        defaultAdmins,
        nodeOperatorManagers,
        nodeOperatorFeeRate,
        confirmExpiry,
        nodeOperatorFeeRecipient,
      ] = await Promise.all([
        activeVault.dashboard.read.getRoleMembers([
          VAULTS_ROOT_ROLES_MAP.defaultAdmin,
        ]),
        activeVault.dashboard.read.getRoleMembers([
          VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
        ]),
        activeVault.dashboard.read.nodeOperatorFeeRate(),
        activeVault.dashboard.read.getConfirmExpiry(),
        activeVault.dashboard.read.nodeOperatorFeeRecipient(),
      ]);
      return {
        defaultAdmins,
        nodeOperatorManagers,
        nodeOperatorFeeRate,
        confirmExpiry,
        nodeOperatorFeeRecipient,
      };
    },
  });
};
