import { Address, Hash, Hex } from 'viem';
import {
  editPermissionsSchema,
  SubmitPermissionsStepEnum,
  ToggleValue,
} from './consts';
import { z } from 'zod';
import { EntirePermissionsType, PERMISSION } from 'consts/roles';

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
  permissionName: PERMISSION;
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
  role: PermissionsKeys;
  title: string;
  tooltip: string;
};

type VaultPermissionInput = { value: string };
export type PermissionsKeys = keyof Omit<
  EntirePermissionsType,
  'NODE_OPERATOR_MANAGER_ROLE'
>;
export type VaultPermissions = Record<PermissionsKeys, VaultPermissionInput[]>;

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
