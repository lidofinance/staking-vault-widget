import { modals } from './consts';
import { VaultOverviewContextKeys } from './contexts';

export type OverviewModalItem = (typeof modals)[number];
export type VaultOverviewModalKey = Extract<
  VaultOverviewContextKeys,
  OverviewModalItem
>;

export type FormulaItem = {
  label: string;
  type: 'variable' | 'operation';
  hasHighlight: boolean;
};
