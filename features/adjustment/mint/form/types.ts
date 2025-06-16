import type { z } from 'zod';
import type { mintFormSchema } from './mint-form-context/validation';
import type { ValidateRecipientArgs } from 'utils/validate-form-value';

export type MintFormValidationContext = {
  mintableStETH: bigint;
  mintableWstETH: bigint;
  validateRecipientArgs: ValidateRecipientArgs;
};

export type MintFormValidationContextAwaitable =
  Promise<MintFormValidationContext>;

export type MintFormValidatedValues = z.infer<
  ReturnType<typeof mintFormSchema>
>;

export type MintFormFieldValues = {
  amount: MintFormValidatedValues['amount'] | null;
  token: MintFormValidatedValues['token'];
  recipient: MintFormValidatedValues['recipient'] | string;
};
