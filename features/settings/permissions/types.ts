import { Address, Hash, Hex } from 'viem';
import {
  editPermissionsSchema,
  SubmitPermissionsStepEnum,
  ToggleValue,
  EDITABLE_ROLES_LIST,
} from './consts';
import { z } from 'zod';
import type { UseQueryResult } from '@tanstack/react-query';

export type PermissionKeys = (typeof EDITABLE_ROLES_LIST)[number];

export type SubmitPermissionsStep =
  | keyof typeof SubmitPermissionsStepEnum
  | undefined;

export type PermissionsSettingsContextValue = {
  permissionsView: ToggleValue;
  handleSetPermissionsView: (value: ToggleValue) => void;
  rolesList: Record<PermissionKeys, FieldSchema[]> | null;
  refetch: UseQueryResult['refetch'];
};

export type PermissionAccounts = {
  permissionName: PermissionKeys;
  addressList: Address[];
};

export type PermissionsSubmittingInfo = {
  step: SubmitPermissionsStep;
  address?: Address;
  tx?: Hash;
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
