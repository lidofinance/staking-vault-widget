import { Address, Hash } from 'viem';

export type InputDataType = 'address' | 'percent' | 'time' | 'default';

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
