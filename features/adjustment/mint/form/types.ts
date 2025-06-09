import type { z } from 'zod';
import type { mintFormSchema } from './mint-form-context/validation';

export type MintFormValidationContext = {
  mintableStETH: bigint;
  mintableWstETH: bigint;
};

export type MintFormValidationContextAwaitable =
  Promise<MintFormValidationContext>;

export type MintFormValidatedValues = z.infer<typeof mintFormSchema>;

export type MintFormFieldValues = {
  amount: MintFormValidatedValues['amount'] | null;
  token: MintFormValidatedValues['token'];
  recipient: MintFormValidatedValues['recipient'] | string;
};
