import { PermissionedSubmitButton, useVault } from 'modules/vaults';

import { useAbandonDashboard } from '../../hooks';

export const TransferAction = () => {
  const { activeVault } = useVault();
  const { abandon } = useAbandonDashboard();
  const { isVaultDisconnected = false } = activeVault ?? {};

  return (
    <PermissionedSubmitButton
      disabled={!isVaultDisconnected}
      onClick={abandon}
      dashboardRole="defaultAdmin"
      size="xs"
      style={{ fontSize: '14px', lineHeight: '24px', width: 'fit-content' }}
    >
      Transfer ownership
    </PermissionedSubmitButton>
  );
};
