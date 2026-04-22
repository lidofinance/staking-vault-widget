import type { z } from 'zod';
import type { withdrawalFormSchema } from './validation';

export type WithdrawalFormValidationContext = {
  availableAmount: bigint;
  obligationsShortfallValue: bigint;
  isPartial: boolean;
};

export type WithdrawalFormValidatedValues = z.infer<
  ReturnType<typeof withdrawalFormSchema>
>;

export type WithdrawalFormFieldValues = {
  amount: WithdrawalFormValidatedValues['amount'] | null;
  index: WithdrawalFormValidatedValues['index'];
  pubkey: WithdrawalFormValidatedValues['pubkey'];
  validatorWithdrawalFee: WithdrawalFormValidatedValues['validatorWithdrawalFee'];
  balance: WithdrawalFormValidatedValues['balance'];
};
