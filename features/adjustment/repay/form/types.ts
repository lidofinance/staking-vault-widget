import type { z } from 'zod';
import type { repayFormSchema } from './repay-form-context/validation';

export type RepayFormValidatedValues = z.infer<
  ReturnType<typeof repayFormSchema>
>;

export type RepayFormFieldValues = {
  amount: RepayFormValidatedValues['amount'] | null;
  token: RepayFormValidatedValues['token'];
};

export type RepayFormValidationContext = {
  maxRepayableStETH: bigint;
  maxRepayableWstETH: bigint;
};

export type RepayFormValidationContextAwaitable =
  Promise<RepayFormValidationContext>;

export type RepayFormContextValue = {
  maxRepayable: bigint | undefined;
  isMaxRepayableLoading: boolean;
};
