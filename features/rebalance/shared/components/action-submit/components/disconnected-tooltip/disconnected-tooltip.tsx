import { vaultTexts } from 'modules/vaults';

import { TooltipText } from '../styles';

const { submit } = vaultTexts.actions.rebalance;

export const DisconnectedTooltip = () => (
  <TooltipText size="xxs">{submit.tooltips.disconnected}</TooltipText>
);
