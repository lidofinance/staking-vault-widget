import { z } from 'zod';

import type { VAULTS_ALL_ROLES } from 'modules/vaults';

import type { VaultTierData, Tier } from './hooks';
import { tierSettingsFormSchema } from './const';

export type VaultTierDataKeys = keyof VaultTierData;

export type SectionData = {
  indicator: VaultTierDataKeys;
  actionRole?: VAULTS_ALL_ROLES;
};

export type SectionPayload = SectionData & {
  title: string;
  isLoading: boolean;
  payload: string | undefined;
};

export type TierDataContextType = {
  values?: VaultTierData;
  selectedTier: Tier | null;
  setSelectedTier: (tier: Tier) => void;
  isLoadingVault: boolean;
  getTierDataToRender: (payload: SectionData) => SectionPayload;
};

export type TierSettingsFormValues = z.infer<typeof tierSettingsFormSchema>;
