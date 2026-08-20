import type { z } from 'zod';
import type { repayFormSchema } from './repay-form-context/validation';
import type {
  VerificationConfirmationFlags,
  VerificationConfirmFieldValues,
} from 'shared/components/banners/additional-verification/types';

export type RepayFormValidatedValues = z.infer<
  ReturnType<typeof repayFormSchema>
>;

export type RepayFormFieldValues = VerificationConfirmFieldValues & {
  amount: RepayFormValidatedValues['amount'] | null;
  token: RepayFormValidatedValues['token'];
};

export type RepayFormValidationContext =
  | {
      maxRepayableStETH: bigint;
      maxRepayableWstETH: bigint;
      additionalVerification: VerificationConfirmationFlags;
    }
  | undefined;

export type RepayFormValidationContextAwaitable =
  Promise<RepayFormValidationContext>;

export type RepayFormContextValue = {
  maxRepayable: bigint | undefined;
  isMaxRepayableLoading: boolean;
};
