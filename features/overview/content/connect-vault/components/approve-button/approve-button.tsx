import { useCallback } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';

import { useConnectVault } from 'features/overview/hooks';

const { action } = vaultTexts.metrics.connectVault;

export const ApproveButton = () => {
  const { address } = useDappStatus();
  const { connectVault } = useConnectVault();
  const { hasAdmin } = useVaultConfirmingRoles();

  const onClick = useCallback(async () => {
    await connectVault();
  }, [connectVault]);

  if (!address || !hasAdmin) {
    return null;
  }

  return (
    <Button size="xs" onClick={onClick}>
      {action}
    </Button>
  );
};
