import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { appPaths } from 'consts/routing';
import { useVault } from 'modules/vaults';

import { ListItem, ListItemContent } from '../styles';

type EnableDepositsProps = {
  isPaused: boolean | undefined;
};

export const EnableDeposits: FC<EnableDepositsProps> = ({ isPaused }) => {
  const { activeVault } = useVault();

  if (!activeVault || !isPaused) return null;

  return (
    <ListItem>
      <ListItemContent>
        <Text size="xxs">
          <Link
            href={appPaths.vaults.vault(activeVault.address).settings('main')}
          >
            Enable deposits
          </Link>{' '}
          in settings.
        </Text>
      </ListItemContent>
    </ListItem>
  );
};
