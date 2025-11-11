import { Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { useVaultOverviewData } from 'features/overview/hooks';

import { Wrapper } from './styles';

export const VaultDisconnected = () => {
  const { activeVault } = useVault();
  const { isLoading } = useVaultOverviewData();

  if (!activeVault?.isVaultDisconnected || isLoading) {
    return null;
  }

  return (
    <Wrapper>
      <Text size="sm" color="secondary" strong>
        stVault is disconnected from the VaultHub
      </Text>
    </Wrapper>
  );
};
