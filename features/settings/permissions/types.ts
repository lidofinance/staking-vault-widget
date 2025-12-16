import type { Address, Hex } from 'viem';
import type { editPermissionsSchema, EDITABLE_ROLES_LIST } from './consts';
import type { z } from 'zod';

export type PermissionKeys = (typeof EDITABLE_ROLES_LIST)[number];
export type PermissionFormField = `rolesSchema.${PermissionKeys}`;

export type PermissionAccounts = {
  permissionName: PermissionKeys;
  addressList: Address[];
};

export type EditPermissionsSchema = z.infer<typeof editPermissionsSchema>;

export type GrantRole = {
  account: Address;
  role: Hex;
};

type VaultPermissionInput = { value: string };

export type VaultPermissions = Record<PermissionKeys, VaultPermissionInput[]>;

export type FieldSchema = {
  action: 'display' | 'revoke' | 'grant';
  account: Address;
};

export type PGDRolesKeys = 'noDepositor' | 'noGuarantor';
