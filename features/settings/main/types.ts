import { Address, Hex } from 'viem';
import { addressSchema, editMainSettingsSchema } from './consts';
import { z } from 'zod';
import { VaultInfo } from 'types';
import { VAULT_ROOT_ROLES } from 'modules/vaults';

export type GrantOrRevokeRole = {
  account: Address;
  role: Hex;
};

export type EditMainSettingsSchema = z.infer<typeof editMainSettingsSchema>;
export type VotingOptionType = {
  id: string;
  value: number;
  type: 'current' | 'to_me' | 'by_me';
  expiryDate?: Date;
};

export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number';

export type MainSettingsOverview = {
  name: string;
  title: string;
  editLabel: string;
  hint?: string;
  dataType: InputDataType;
  actionText?: string;
  vaultKey: keyof VaultInfo;
  canEditRole: VAULT_ROOT_ROLES | 'confirmingRoles';
};

export type MainSettingsVoting = Omit<
  MainSettingsOverview,
  'dataType' | 'name'
> & {
  unitIndicator: '%' | ' hours';
  name: VotingKeys;
  textFieldName: VotingCustomKeys;
};

export type TxData = {
  grantRoles?: GrantOrRevokeRole[];
  revokeRoles?: GrantOrRevokeRole[];
  confirmExpiry?: bigint;
  nodeOperatorFeeBP?: bigint;
};

export type RoleFieldSchema = z.infer<typeof addressSchema>;
export type ManagersKeys = 'nodeOperatorManagers' | 'defaultAdmins';
export type VotingKeys = 'nodeOperatorFeeBP' | 'confirmExpiry';
export type VotingCustomKeys =
  | 'nodeOperatorFeeBPCustom'
  | 'confirmExpiryCustom';
export type ManagersNewAddresses = {
  addresses: Record<ManagersKeys, RoleFieldSchema[]>;
};

export type ChipBadge = Date | string | undefined;

export type MainSettingsDataContextValue = {
  defaultAdmins: RoleFieldSchema[];
  nodeOperatorManagers: RoleFieldSchema[];
  nodeOperatorFeeBP: VotingOptionType[];
  confirmExpiry: VotingOptionType[];
};
