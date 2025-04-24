import { Address, Hash } from 'viem';
import { InputProps } from '@lidofinance/lido-ui';
import { CREATE_VAULT_FORM_STEPS, ToggleValue } from './consts';
import { VAULTS_NO_ROLES_MAP, VAULTS_OWNER_ROLES_MAP } from 'modules/vaults';

export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number';

export enum SubmitStepEnum {
  initiate = 'initiate',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
}

export type SubmitStep = keyof typeof SubmitStepEnum | undefined;

export type SubmittingInfo = {
  step: SubmitStep;
  address?: Address;
  tx?: Hash;
};

export type FieldName = MainSettingsKeys | keyof typeof VAULTS_OWNER_ROLES_MAP;

export type CreateVaultType = {
  defaultAdmin: string;
  nodeOperator: string;
  nodeOperatorManager: string;
  nodeOperatorFeeBP: number;
  confirmExpiry: number;
  roles: {
    [K in PermissionKeys]: string[];
  };
};

export type MainSettingsEntryType = {
  name: MainSettingsKeys;
  dataType: InputDataType;
  title: string;
  label: string;
  notes?: string;
  type?: string;
  afterText?: string;
};

export type VaultMainSettingsType = Omit<CreateVaultType, 'roles'> & {
  confirmMainSettings: boolean;
};

export type MainSettingsKeys = keyof VaultMainSettingsType;

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

export type FieldConfig<T extends FieldName> = {
  name: T;
  title: string;
  label?: string;
  notes?: string;
  type?: InputProps['type'];
  dataType?: InputDataType;
  afterText?: string;
};

export type CreateVaultDataContextValue = {
  step: CreateVaultStep;
  permissionsView: ToggleValue;
  submitStep: SubmittingInfo | undefined;
  handleSetStep: (step: CreateVaultStep) => void;
  handleSetPermissionsView: (value: ToggleValue) => void;
  handleCancelSubmit: () => void;
};

export type CreateVaultStep =
  (typeof CREATE_VAULT_FORM_STEPS)[keyof typeof CREATE_VAULT_FORM_STEPS];

export type PermissionField = {
  account: Address;
  state: 'grant' | 'restore';
};
