import { Address } from 'viem';

export enum SubmitStepEnum {
  edit = 'edit',
  initiate = 'initiate',
  collecting = 'collecting',
  simulating = 'simulating',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
  overview = 'overview',
}

export type SubmitStep = keyof typeof SubmitStepEnum;

export type SubmitPayload = {
  step: SubmitStep;
  tx?: Address;
};
