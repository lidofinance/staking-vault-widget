import { PermissionedSubmitButton, useVault } from 'modules/vaults';

import { useAbandonDashboard } from '../../hooks';

export const TransferAction = () => {
  const { activeVault } = useVault();
  const {
    abandon,
    mutation: { isPending },
  } = useAbandonDashboard();
  const { isVaultDisconnected = false } = activeVault ?? {};

  return (
    <PermissionedSubmitButton
      disabled={!isVaultDisconnected}
      loading={isPending}
      onClick={abandon}
      dashboardRole="defaultAdmin"
      size="xs"
      style={{ fontSize: '14px', lineHeight: '24px', width: 'fit-content' }}
      data-testid="action-btn"
    >
      Transfer ownership
    </PermissionedSubmitButton>
  );
};
