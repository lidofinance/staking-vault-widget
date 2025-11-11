import { Button, Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { useVaultOverviewData } from 'features/overview/hooks';

import { ErrorState } from './styles';

export const RetryFetching = () => {
  const { activeVault } = useVault();
  const { error, refetch } = useVaultOverviewData();

  if (!error || activeVault?.isVaultDisconnected) {
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
