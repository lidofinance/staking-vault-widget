import type { Address } from 'viem';
import type { z } from 'zod';

import type { VAULT_ROOT_ROLES } from 'modules/vaults';

import type { mainSettingsFormSchema } from './consts';
import { UseQueryResult } from '@tanstack/react-query';

import type { Confirmation } from 'utils/get-confirmations';

export type MainSettingsFormValidatedValues = z.infer<
  typeof mainSettingsFormSchema
>;

export type MainSettingFormsValues = MainSettingsFormValidatedValues & {
  nodeOperatorFeeRecipient:
    | MainSettingsFormValidatedValues['nodeOperatorFeeRecipient']
    | string;
  nodeOperatorManagers:
    | MainSettingsFormValidatedValues['nodeOperatorManagers']
    | null;
  defaultAdmins: MainSettingsFormValidatedValues['defaultAdmins'] | null;
};

export type VaultMainSettingsData = {
  defaultAdmins: Address[];
  nodeOperatorManagers: Address[];
  nodeOperatorFeeRecipient: Address;

  nodeOperatorFeeRate: bigint;
  nodeOperatorFeeConfirmations: Confirmation[];

  confirmExpiry: bigint;
  confirmExpiryConfirmations: Confirmation[];
};

export type MainSettingsFormData = {
  defaultAdmins: Address[];
  nodeOperatorManagers: Address[];
  nodeOperatorFeeRecipient: Address;

  nodeOperatorFeeRate: VotingOptionType[];
  nodeOperatorFeeRateCurrent: string;

  confirmExpiry: VotingOptionType[];
  confirmExpiryCurrent: string;
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
};

export type ManagersKeys = 'nodeOperatorManagers' | 'defaultAdmins';
