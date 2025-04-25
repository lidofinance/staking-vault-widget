import { Address } from 'viem';

export enum SubmitStepEnum {
  edit = 'edit',
  initiate = 'initiate',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
}

export type SubmitStep = keyof typeof SubmitStepEnum;

export type SubmitPayload = {
  step: SubmitStep;
  tx?: Address;
};
