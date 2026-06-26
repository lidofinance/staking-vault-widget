import { vaultTexts } from 'modules/vaults';

import { TooltipText } from '../styles';

const { submit } = vaultTexts.actions.rebalance;

export const ForceInsufficientFundsTooltip = () => (
  <TooltipText size="xxs">{submit.tooltips.forceInsufficientFunds}</TooltipText>
);
