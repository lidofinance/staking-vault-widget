import type { z } from 'zod';
import type { WithdrawFormSchema } from './withdraw-form-context/validation';
import type { useWithdrawable } from './hooks';
import type { ValidateRecipientArgs } from 'utils/zod-validation';

export type WithdrawFormValidatedValues = z.infer<
  ReturnType<typeof WithdrawFormSchema>
>;

export type WithdrawFormFieldValues = {
  amount: WithdrawFormValidatedValues['amount'] | null;
  token: WithdrawFormValidatedValues['token'];
  // while this cast is redundant, it acts as better source of truth
  recipient: WithdrawFormValidatedValues['recipient'] | string;
};

export type WithdrawFormValidationContext = {
  withdrawableEther: bigint;
  validateRecipientArgs: ValidateRecipientArgs;
};

export type WithdrawFormValidationContextAwaitable =
  Promise<WithdrawFormValidationContext>;

export type WithdrawFormData = {
  withdrawableEtherQuery: ReturnType<typeof useWithdrawable>;
};
