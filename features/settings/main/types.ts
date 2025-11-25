import type { Address } from 'viem';
import type { z } from 'zod';

import type { VAULT_ROOT_ROLES } from 'modules/vaults';

import { mainSettingsFormSchema, PDGPolicy } from './consts';
import { UseQueryResult } from '@tanstack/react-query';

import type { Confirmation } from 'utils/get-confirmations';

export type MainSettingsFormValidatedValues = z.infer<
  typeof mainSettingsFormSchema
>;

export type MainSettingFormsValues = MainSettingsFormValidatedValues & {
  feeRecipient: MainSettingsFormValidatedValues['feeRecipient'] | string;
  nodeOperatorManagers:
    | MainSettingsFormValidatedValues['nodeOperatorManagers']
    | null;
  defaultAdmins: MainSettingsFormValidatedValues['defaultAdmins'] | null;
};

export type VaultMainSettingsData = {
  defaultAdmins: Address[];
  nodeOperatorManagers: Address[];
  feeRecipient: Address;

  feeRate: number;
  nodeOperatorFeeConfirmations: Confirmation[];

  confirmExpiry: bigint;
  confirmExpiryConfirmations: Confirmation[];
  isDepositAllowed: boolean;
  pdgPolicy: string;
};

export type MainSettingsFormData = {
  defaultAdmins: Address[];
  nodeOperatorManagers: Address[];
  feeRecipient: Address;

  feeRate: VotingOptionType[];
  nodeOperatorFeeRateCurrent: string;

  confirmExpiry: VotingOptionType[];
  confirmExpiryCurrent: string;

  isDepositAllowed: boolean;
  pdgPolicy: string;
};

export type MainSettingsDataContextValue = UseQueryResult<MainSettingsFormData>;

export type RoleFieldSchema =
  MainSettingsFormValidatedValues['defaultAdmins'][number];

export type VotingOptionType = {
  value: string;
  type: 'current' | 'Proposed to me' | 'My proposal' | 'custom';
  tags: string[];
  symbol?: string;
  format?: (seconds: number | string) => string;
  placeholder?: string;
};

export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number';

export type MainSettingsOverview = {
  name: ManagersKeys;
  title: string;
  editLabel: string;
  hint?: string;
  dataType: InputDataType;
  actionText?: string;
  canEditRole: VAULT_ROOT_ROLES | 'confirmingRoles';
  dataTestId?: string;
};

export type ManagersKeys = 'nodeOperatorManagers' | 'defaultAdmins';
export type PDGOptions = keyof typeof PDGPolicy;
