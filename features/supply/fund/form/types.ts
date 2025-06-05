import type { z } from 'zod';
import type { FundFormSchema } from './fund-form-provider/validation';
import type { useFundFormData } from './fund-form-provider/hooks';

export type FundFormDataValidationContext = {
  ethBalance: bigint;
  wethBalance: bigint;
};

export type FundFormDataAwaitableValidationContext =
  Promise<FundFormDataValidationContext>;

export type FundFormValidatedValues = z.infer<typeof FundFormSchema>;

export type FundFormFieldValues = {
  // booleans as is
  token: FundFormValidatedValues['token'];
  mintSteth: FundFormValidatedValues['mintSteth'];
  //  will be validated to correct types
  amount: bigint | null;
  mintAddress: string;
};

// underlying type is too complex
export type FundFormData = ReturnType<typeof useFundFormData>;
