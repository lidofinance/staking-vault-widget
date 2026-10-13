import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults';

import { CustodyBadgeStyled } from './styles';

const { custodyBadge } = vaultTexts.actions.settings.permissions;

export const CustodyBadge: FC = () => (
  <CustodyBadgeStyled data-testid="custodyBadge">
    {custodyBadge}
  </CustodyBadgeStyled>
);
