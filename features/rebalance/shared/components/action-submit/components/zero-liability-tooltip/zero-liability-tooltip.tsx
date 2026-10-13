import { vaultTexts } from 'modules/vaults';

import { TooltipText } from '../styles';

const { submit } = vaultTexts.actions.rebalance;

export const ZeroLiabilityTooltip = () => (
  <TooltipText size="xxs">{submit.tooltips.zeroLiability}</TooltipText>
);
