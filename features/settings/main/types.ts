import type { Address, Hex, DecodeFunctionDataReturnType } from 'viem';
import type { z } from 'zod';

import type { VAULT_ROOT_ROLES } from 'modules/vaults';
import type { dashboardAbi } from 'abi/dashboard-abi';

import type { mainSettingsFormSchema } from './consts';
import { UseQueryResult } from '@tanstack/react-query';

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

type DecodedData = DecodeFunctionDataReturnType<
  typeof dashboardAbi,
  'setConfirmExpiry' | 'setNodeOperatorFeeRate'
>;

export type ConfirmationsData = {
  member: Address;
  role: Hex;
  expiryTimestamp: bigint;
  expiryDate: Date;
  data: Hex;
  decodedData: DecodedData;
};

export type VaultMainSettingsData = {
  defaultAdmins: Address[];
  nodeOperatorManagers: Address[];
  nodeOperatorFeeRecipient: Address;

  nodeOperatorFeeRate: bigint;
  nodeOperatorFeeConfirmations: ConfirmationsData[];

  confirmExpiry: bigint;
  confirmExpiryConfirmations: ConfirmationsData[];
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
  dataTestId?: string;
};

export type ManagersKeys = 'nodeOperatorManagers' | 'defaultAdmins';
