import type { FC } from 'react';
import Link from 'next/link';

import { appPaths } from 'consts/routing';
import { useVault, useVaultConfirmingRoles } from 'modules/vaults';

import { ListItem, ListItemContent } from '../styles';
import { TextStyled } from '../../../styles';

type EnableDepositsProps = {
  isPausedByUser: boolean | undefined;
};

export const EnableDeposits: FC<EnableDepositsProps> = ({ isPausedByUser }) => {
  const { activeVault } = useVault();
  const { hasAdmin } = useVaultConfirmingRoles();

  if (!activeVault || !isPausedByUser || !hasAdmin) return null;

  return (
    <ListItem>
      <ListItemContent>
        <TextStyled size="xxs">
          <Link
            href={appPaths.vaults.vault(activeVault.address).settings('main')}
          >
            Enable deposits
          </Link>{' '}
          in settings.
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
