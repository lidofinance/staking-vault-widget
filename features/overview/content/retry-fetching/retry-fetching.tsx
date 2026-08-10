import { Button, Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { useVaultOverviewData } from 'modules/vaults';

import { ErrorState } from './styles';

export const RetryFetching = () => {
  const { activeVault } = useVault();
  const { error, refetch } = useVaultOverviewData();

  // reads through the Dashboard/VaultHub are expected to fail for a vault that
  // is disconnected or not connected yet, so the retry row is only noise there
  if (
    !error ||
    activeVault?.isVaultDisconnected ||
    activeVault?.isPendingConnect
  ) {
    return null;
  }

  return (
    <ErrorState>
      <Text color="error" size="xs" weight={700}>
        Failed to fetch data
      </Text>
      <Button color="error" variant="ghost" size="xs" onClick={() => refetch()}>
        Retry
      </Button>
    </ErrorState>
  );
};
