import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';
import { useVault } from 'modules/vaults';

import { Title, Wrapper } from './styles';

export const DisconnectedVault = () => {
  const { activeVault } = useVault();

  if (!activeVault || !activeVault.isVaultDisconnected) {
    return null;
  }

  return (
    <Wrapper>
      <Title>
        <WarningTriangle />
        <Text size="xs" as="h3" strong>
          Vault is disconnected from VaultHub.
        </Text>
      </Title>

      <Text size="xxs">
        This vault is disconnected from VaultHub, and some operations are not
        supported in this UI, including supplying ETH and minting or repaying
        stETH.
      </Text>
    </Wrapper>
  );
};
