import { Text, Link } from '@lidofinance/lido-ui';

import { config } from 'config';

import { DescriptionWrapper } from './styles';

const { docsOrigin } = config;
const disconnectDocLink = `${docsOrigin}/run-on-lido/stvaults/operational-and-management-guides/stvault-disconnect-guide/`;

export const DisconnectDescription = () => {
  return (
    <DescriptionWrapper data-testid="disconnect-description">
      <Text size="xxs" color="secondary" data-testid="description">
        stVaults have 1 ETH as a connection deposit meaning that 1 ETH is being
        locked in stVault as collateral for connection to VaultHub and allowing
        minting stETH. To unlock 1 ETH for withdrawal, the stVault needs to be
        disconnected from VaultHub.
      </Text>
      <Link href={disconnectDocLink} data-testid="docs-link">
        Learn what functionality remains available after disconnection.
      </Link>
    </DescriptionWrapper>
  );
};
