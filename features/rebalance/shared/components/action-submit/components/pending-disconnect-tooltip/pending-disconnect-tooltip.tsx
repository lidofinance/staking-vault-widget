import { vaultTexts } from 'modules/vaults';

import { TooltipText } from '../styles';

const { submit } = vaultTexts.actions.rebalance;

export const PendingDisconnectTooltip = () => (
  <TooltipText size="xxs">{submit.tooltips.pendingDisconnect}</TooltipText>
);
