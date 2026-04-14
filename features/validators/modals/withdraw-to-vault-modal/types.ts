import type { z } from 'zod';
import type { withdrawalFormSchema } from './validation';

export type WithdrawalFormValidationContext = {
  availableAmount: bigint;
};

export type WithdrawalFormValidatedValues = z.infer<
  ReturnType<typeof withdrawalFormSchema>
>;

export type WithdrawalFormFieldValues = {
  amount: WithdrawalFormValidatedValues['amount'] | null;
  index: WithdrawalFormValidatedValues['index'];
  pubkey: WithdrawalFormValidatedValues['pubkey'];
};
