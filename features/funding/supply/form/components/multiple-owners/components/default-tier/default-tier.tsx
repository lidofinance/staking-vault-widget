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
      The Vault Owner role (DEFAULT_ADMIN_ROLE) is assigned to one or more other
      addresses, and the stVault is in the Default Tier. This UI does not allow
      supplying ETH, repaying stETH, or rebalancing in this case due to a higher
      risk of fund loss. To enable this action in the web interface, this
      stVault must be{' '}
      <Link href={link}>moved to one of the Node Operator’s tiers.</Link>
    </Text>
  );
};
