import { Address, Hash, Hex } from 'viem';
import {
  editPermissionsSchema,
  SubmitPermissionsStepEnum,
  ToggleValue,
} from './consts';
import { z } from 'zod';
import { EDITABLE_PERMISSIONS } from 'consts/roles';

export type SubmitPermissionsStep =
  | keyof typeof SubmitPermissionsStepEnum
  | undefined;

export type PermissionsSettingsContextValue = {
  submitStep: PermissionsSubmittingInfo;
  permissionsView: ToggleValue;
  handleSetPermissionsView: (value: ToggleValue) => void;
  handleCancelSubmit: () => void;
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
  role: EDITABLE_PERMISSIONS;
  title: string;
  tooltip: string;
};

type VaultPermissionInput = { value: string };
export type VaultPermissions = Record<
  EDITABLE_PERMISSIONS,
  VaultPermissionInput[]
>;
