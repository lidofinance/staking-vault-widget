import { vaultTexts } from 'modules/vaults';

import { TooltipText } from '../styles';

const { submit } = vaultTexts.actions.rebalance;

export const PendingConnectTooltip = () => (
  <TooltipText size="xxs">{submit.tooltips.pendingConnect}</TooltipText>
);
