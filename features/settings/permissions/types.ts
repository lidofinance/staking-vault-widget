import { Address, Hash, Hex } from 'viem';
import {
  editPermissionsSchema,
  SubmitPermissionsStepEnum,
  ToggleValue,
  EDITABLE_ROLES_MAP,
} from './consts';
import { z } from 'zod';

export type PermissionKeys = keyof typeof EDITABLE_ROLES_MAP;

export type SubmitPermissionsStep =
  | keyof typeof SubmitPermissionsStepEnum
  | undefined;

export type PermissionsSettingsContextValue = {
  permissionsView: ToggleValue;
  handleSetPermissionsView: (value: ToggleValue) => void;
  rolesList: PermissionAccounts[];
  refetch: () => void;
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

export type PermissionsRoles = {
  role: PermissionKeys;
  title: string;
  tooltip: string;
};

type VaultPermissionInput = { value: string };

export type VaultPermissions = Record<PermissionKeys, VaultPermissionInput[]>;

export type FieldSchema =
  | {
      group: 'eventual';
      state: 'restore' | 'grant';
      account: Address;
    }
  | {
      group: 'settled';
      state: 'remove' | 'display';
      account: Address;
    };
