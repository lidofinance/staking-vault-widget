import { Address, Hash } from 'viem';
import { InputProps } from '@lidofinance/lido-ui';
import { ToggleValue } from './consts';

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

export type ConfirmationList =
  | 'mainSettings'
  | 'vaultManagerPermissions'
  | 'nodeOperatorManagerPermissions';

export type FieldName =
  | 'nodeOperator'
  | 'assetRecoverer'
  | 'nodeOperatorManager'
  | 'nodeOperatorFeeBP'
  | 'curatorFeeBP'
  | 'confirmExpiry'
  | 'defaultAdmin'
  | 'funders'
  | 'withdrawers'
  | 'minters'
  | 'burners'
  | 'rebalancers'
  | 'depositPausers'
  | 'depositResumers'
  | 'validatorExitRequesters'
  | 'validatorWithdrawalTriggerers'
  | 'disconnecters'
  | 'curatorFeeSetters'
  | 'curatorFeeClaimers'
  | 'nodeOperatorFeeClaimers';

type EnsureKeys<T extends Record<FieldName, any>> = T;

export type CreateVaultType = EnsureKeys<{
  nodeOperator: string;
  assetRecoverer: string;
  nodeOperatorManager: string;
  nodeOperatorFeeBP: number;
  curatorFeeBP: number;
  confirmExpiry: number;
  defaultAdmin: string;
  funders: string[];
  withdrawers: string[];
  minters: string[];
  burners: string[];
  rebalancers: string[];
  depositPausers: string[];
  depositResumers: string[];
  validatorExitRequesters: string[];
  validatorWithdrawalTriggerers: string[];
  disconnecters: string[];
  curatorFeeSetters: string[];
  curatorFeeClaimers: string[];
  nodeOperatorFeeClaimers: string[];
}>;

type FilterArrayKeys<T> = {
  [K in keyof T]: T[K] extends any[] ? never : K;
}[keyof T];

export type MainSettingsKeys =
  | FilterArrayKeys<CreateVaultType>
  | 'confirmMainSettings';

export type VaultMainSettingsType = {
  nodeOperator: string;
  assetRecoverer: string;
  nodeOperatorManager: string;
  nodeOperatorFeeBP: number;
  curatorFeeBP: number;
  confirmExpiry: number;
  defaultAdmin: string;
  confirmMainSettings: boolean;
};

export type PermissionKeys = keyof Omit<CreateVaultType, MainSettingsKeys>;

type VaultPermissionInput = { value: string };
export type VaultPermissionsType = {
  funders: VaultPermissionInput[];
  withdrawers: VaultPermissionInput[];
  minters: VaultPermissionInput[];
  burners: VaultPermissionInput[];
  rebalancers: VaultPermissionInput[];
  depositPausers: VaultPermissionInput[];
  depositResumers: VaultPermissionInput[];
  validatorExitRequesters: VaultPermissionInput[];
  validatorWithdrawalTriggerers: VaultPermissionInput[];
  disconnecters: VaultPermissionInput[];
  curatorFeeSetters: VaultPermissionInput[];
  curatorFeeClaimers: VaultPermissionInput[];
  nodeOperatorFeeClaimers: VaultPermissionInput[];
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
  step: number;
  permissionsView: ToggleValue;
  submitStep: SubmittingInfo | undefined;
  handleSetStep: (step: number) => void;
  handleSetPermissionsView: (value: ToggleValue) => void;
  handleCancelSubmit: () => void;
};
