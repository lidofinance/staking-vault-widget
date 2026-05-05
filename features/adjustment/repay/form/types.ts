import type { z } from 'zod';
import type { repayFormSchema } from './repay-form-context/validation';
import type {
  AntiScamConfirmationFlags,
  AntiScamConfirmFieldValues,
} from 'shared/components/banners/anti-scam/types';

export type RepayFormValidatedValues = z.infer<
  ReturnType<typeof repayFormSchema>
>;

export type RepayFormFieldValues = AntiScamConfirmFieldValues & {
  amount: RepayFormValidatedValues['amount'] | null;
  token: RepayFormValidatedValues['token'];
};

export type RepayFormValidationContext = {
  maxRepayableStETH: bigint;
  maxRepayableWstETH: bigint;
  antiScam: AntiScamConfirmationFlags;
};

export type RepayFormValidationContextAwaitable =
  Promise<RepayFormValidationContext>;

export type RepayFormContextValue = {
  maxRepayable: bigint | undefined;
  isMaxRepayableLoading: boolean;
};
