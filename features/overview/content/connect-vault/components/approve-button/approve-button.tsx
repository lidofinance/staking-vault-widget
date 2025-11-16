import { useCallback } from 'react';
import { Button } from '@lidofinance/lido-ui';

import {
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
  vaultTexts,
} from 'modules/vaults';
import { useDappStatus } from 'modules/web3';

import { useConnectVault, useVaultOverviewData } from 'features/overview/hooks';

const { action } = vaultTexts.metrics.connectVault;

export const ApproveButton = () => {
  const { address } = useDappStatus();
  const { connectVault } = useConnectVault();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { refetch: refetchVault } = useVault();
  const { refetch: refetchVaultOverview } = useVaultOverviewData();
  const { hasPermission } = useVaultPermission('vaultConfiguration');

  const onClick = useCallback(async () => {
    await connectVault();
    await refetchVault({ cancelRefetch: true, throwOnError: false });
    await refetchVaultOverview({ cancelRefetch: true, throwOnError: false });
  }, [connectVault, refetchVault, refetchVaultOverview]);

  if (!address || !(hasAdmin || hasPermission)) {
    return null;
  }

  return (
    <Button size="sm" onClick={onClick}>
      {action}
    </Button>
  );
};
