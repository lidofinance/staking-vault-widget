import { Tooltip } from '@lidofinance/lido-ui';

import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';
import { vaultTexts } from 'modules/vaults';

import { BadgeTooltip } from '../badge-tooltip';

import { IconWrapper } from './styles';

const { unVerifiedOperator } =
  vaultTexts.actions.overview.vaultGeneral.nodeOperator;

export const UnverifiedOperator = () => {
  return (
    <Tooltip
      title={<BadgeTooltip description={unVerifiedOperator} />}
      placement="bottomLeft"
    >
      <IconWrapper>
        <WarningTriangle />
      </IconWrapper>
    </Tooltip>
  );
};
