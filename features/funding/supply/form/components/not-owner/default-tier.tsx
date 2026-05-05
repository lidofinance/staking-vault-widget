import { useMemo } from 'react';
import Link from 'next/link';
import { Text } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { useVault } from 'modules/vaults';

export const DefaultTier = () => {
  const { vaultAddress } = useVault();
  const link = useMemo(() => {
    if (!vaultAddress) {
      return '#';
    }

    return appPaths.vaults.vault(vaultAddress).settings('tier');
  }, [vaultAddress]);

  return (
    <Text size="xxs">
      This stVault is not owned by you, and the permission to supply ETH was
      delegated to your address by the Vault Owner. Additionally, this stVault
      is currently in the Default Tier. This interface does not allow supplying
      ETH, repaying stETH, or rebalancing in this case due to a higher risk of
      fund loss. To enable these actions in the web interface, the stVault{' '}
      <Link href={link}>
        must be moved to one of the Node Operator’s tiers.
      </Link>
    </Text>
  );
};
