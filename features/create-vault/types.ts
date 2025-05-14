import type { Address } from 'viem';
import type { CREATE_VAULT_FORM_STEPS } from './consts';
import type {
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
} from 'modules/vaults';

import type { createVaultSchema } from './create-vault-form/validation';
import type { z } from 'zod';

export type CreateVaultSchema = z.infer<typeof createVaultSchema>;

export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number';

export type VaultMainSettingsType = Omit<CreateVaultSchema, 'roles'>;

export type MainSettingsKeys = keyof VaultMainSettingsType;

export type MainSettingsEntryType = {
  name: MainSettingsKeys;
  dataType: InputDataType;
  title: string;
  label: string;
  notes?: string;
  type?: string;
  afterText?: string;
};

export type PermissionKeys =
  | keyof typeof VAULTS_OWNER_ROLES_MAP
  | keyof typeof VAULTS_NO_ROLES_MAP;

export type VaultPermissionsType = {
  [K in PermissionKeys]: { value: string }[];
};

export type PermissionsRoles = {
  role: PermissionKeys;
  title: string;
  tooltip: string;
};

export type CreateVaultDataContextValue = {
  step: CreateVaultStep;
  handleSetStep: (step: CreateVaultStep) => void;
};

export type CreateVaultStep =
  (typeof CREATE_VAULT_FORM_STEPS)[keyof typeof CREATE_VAULT_FORM_STEPS];

export type PermissionField = {
  account: Address;
  state: 'grant' | 'restore';
};
