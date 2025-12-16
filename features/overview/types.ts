import type { VAULTS_ALL_ROLES } from 'modules/vaults';
import type { modals } from './consts';
import type { VaultOverviewData } from './hooks';
import type { Address } from 'viem';

export type OverviewModalItem = (typeof modals)[number];
export type VaultOverviewModalKey = Extract<
  VaultOverviewContextKeys,
  OverviewModalItem
>;

export type VaultOverviewContextKeys =
  keyof Required<VaultOverviewContextType>['values'];

export type FormulaItem = {
  label: string;
  type: 'variable' | 'operation';
  hasHighlight: boolean;
  vaultIndicator?: VaultOverviewContextKeys;
};

export type SectionData = {
  indicator: VaultOverviewModalKey;
  actionRole?: VAULTS_ALL_ROLES;
  actionLink?: (vaultAddress: Address) => string;
  textSize?: 'lg' | 'xl';
  titleView?: 'row' | 'column';
};

export type SectionPayload = SectionData & {
  title: string;
  learnMoreLink: string;
  description?: string;
  hint?: string;
  isLoading: boolean;
  payload?: string | number | boolean | bigint;
};

export type VaultOverviewContextType = {
  values?: VaultOverviewData;
  isLoadingVault: boolean;
  getVaultDataToRender: (payload: SectionData) => SectionPayload;
};
