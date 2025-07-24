import type {
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
} from 'modules/vaults';

import type { createVaultSchema } from './create-vault-form/validation';
import type { z } from 'zod';

export type CreateVaultSchema = z.infer<typeof createVaultSchema>;

export type CreateVaultFormValues = {
  nodeOperator: string;
  vaultManager: { value: string }[];
  nodeOperatorManager: string;
  nodeOperatorFeeRate: string;
  confirmExpiry: string;
  acceptTerms: CreateVaultSchema['acceptTerms'];
  roles: CreateVaultSchema['roles'];
  step: CreateVaultSchema['step'];
};
export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number'
  | 'confirm'
  | 'addressArray';

export type VaultMainSettingsType = Omit<CreateVaultSchema, 'roles'>;

export type MainSettingsKeys = keyof VaultMainSettingsType;

export type MainSettingsEntryType = {
  name: MainSettingsKeys;
  dataType: InputDataType;
  title?: string;
  label?: string;
  notes?: string;
  hint?: string;
  type?: string;
};

export type PermissionKeys =
  | keyof typeof VAULTS_OWNER_ROLES_MAP
  | keyof typeof VAULTS_NO_ROLES_MAP;
