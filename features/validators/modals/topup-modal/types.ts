import type { z } from 'zod';
import type { topUpFormSchema } from './validation';

export type TopUpFormValidationContext = {
  availableBalance: bigint;
};

export type TopUpFormValidatedValues = z.infer<
  ReturnType<typeof topUpFormSchema>
>;

export type TopUpFormFieldValues = {
  amount: TopUpFormValidatedValues['amount'] | null;
  index: TopUpFormValidatedValues['index'] | null;
  pubkey: TopUpFormValidatedValues['pubkey'] | null;
};
