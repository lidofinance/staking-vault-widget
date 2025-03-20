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

export type FieldConfig = {
  name: string;
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
