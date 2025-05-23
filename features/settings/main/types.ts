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

export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number';

export type MainSettingsOverview = {
  name: string;
  title: string;
  label: string;
  editLabel: string;
  hint?: string;
  dataType: InputDataType;
  actionText?: string;
  vaultKey: keyof VaultInfo;
  canEditRole: VAULT_ROOT_ROLES | 'confirmingRoles';
};

export type TxData = {
  grantRoles?: GrantOrRevokeRole[];
  revokeRoles?: GrantOrRevokeRole[];
  confirmExpiry?: bigint;
  nodeOperatorFeeBP?: bigint;
};

export type RoleFieldSchema = z.infer<typeof addressSchema>;
export type ManagersKeys = 'nodeOperatorManagers' | 'defaultAdmins';
export type ManagersNewAddresses = {
  addresses: Record<ManagersKeys, RoleFieldSchema[]>;
};
