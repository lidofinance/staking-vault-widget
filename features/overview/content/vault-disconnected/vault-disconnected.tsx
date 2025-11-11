import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { Wrapper } from './styles';

type VaultDisconnectedProps = {
  isVaultDisconnected: boolean | undefined;
};

export const VaultDisconnected: FC<VaultDisconnectedProps> = ({
  isVaultDisconnected,
}) => {
  if (!isVaultDisconnected) {
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
