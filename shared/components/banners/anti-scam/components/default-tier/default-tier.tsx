import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import NextLink from 'next/link';

import { useVaultSettingsLink } from '../../hooks';
import type { AntiScamAction, RiskVariant } from '../../types';

type DefaultTierProps = {
  variant: RiskVariant;
  action: AntiScamAction;
};

export const DefaultTier: FC<DefaultTierProps> = ({ variant, action }) => {
  const link = useVaultSettingsLink('tier');

  if (variant === 'multipleOwners') {
    return (
      <Text size="xxs">
        The Vault Owner role (DEFAULT_ADMIN_ROLE) is assigned to one or more
        other addresses, and the stVault is in the Default Tier. This UI does
        not allow supplying ETH, repaying stETH, or rebalancing in this case due
        to a higher risk of fund loss. To enable this action in the web
        interface, this stVault must be{' '}
        <NextLink href={link}>
          moved to one of the Node Operator&apos;s tiers.
        </NextLink>
      </Text>
    );
  }

  return (
    <Text size="xxs">
      This stVault is not owned by you, and the permission to {action} ETH was
      delegated to your address by the Vault Owner. Additionally, this stVault
      is currently in the Default Tier. This interface does not allow supplying
      ETH, repaying stETH, or rebalancing in this case due to a higher risk of
      fund loss. To enable these actions in the web interface, the stVault{' '}
      <NextLink href={link}>
        must be moved to one of the Node Operator&apos;s tiers.
      </NextLink>
    </Text>
  );
};
