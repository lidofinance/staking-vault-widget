import { Tooltip } from '@lidofinance/lido-ui';

import { ReactComponent as VerificationBadge } from 'assets/icons/verification-badge.svg';
import { vaultTexts } from 'modules/vaults';

import { BadgeTooltip } from '../badge-tooltip';
import { IconWrapper } from './styles';

const { verifiedOperator } =
  vaultTexts.actions.overview.vaultGeneral.nodeOperator;

export const VerifiedOperator = () => {
  return (
    <Tooltip
      title={<BadgeTooltip description={verifiedOperator} />}
      placement="bottomLeft"
    >
      <IconWrapper>
        <VerificationBadge />
      </IconWrapper>
    </Tooltip>
  );
};
