import { Address } from 'viem';
import { addressSchema, editMainSettingsSchema } from './consts';
import { z } from 'zod';
import { VaultInfo } from 'types';
import { VAULT_ROOT_ROLES } from 'modules/vaults';

export type EditMainSettingsSchema = z.infer<typeof editMainSettingsSchema>;
export type EditMainSettingsValues = {
  nodeOperatorManagers: EditMainSettingsSchema['nodeOperatorManagers'] | null;
  defaultAdmins: EditMainSettingsSchema['defaultAdmins'] | null;
  nodeOperatorFeeRate: EditMainSettingsSchema['nodeOperatorFeeRate'];
  nodeOperatorFeeRateCustom: EditMainSettingsSchema['nodeOperatorFeeRateCustom'];
  confirmExpiry: EditMainSettingsSchema['confirmExpiry'];
  confirmExpiryCustom: EditMainSettingsSchema['confirmExpiryCustom'];
};
export type RoleFieldSchema = z.infer<typeof addressSchema>;
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
  vaultKey: keyof VaultInfo;
  canEditRole: VAULT_ROOT_ROLES | 'confirmingRoles';
};

export type ManagersKeys = 'nodeOperatorManagers' | 'defaultAdmins';

export type MainSettingsDataContextValue = {
  defaultAdmins: RoleFieldSchema[];
  nodeOperatorManagers: RoleFieldSchema[];
  nodeOperatorFeeRecipient: Address;
  nodeOperatorFeeRate: VotingOptionType[];
  confirmExpiry: VotingOptionType[];
};
