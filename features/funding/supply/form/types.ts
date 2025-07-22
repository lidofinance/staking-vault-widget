import type { z } from 'zod';
import type { supplyFormSchema } from './supply-form-provider/validation';
import type { useSupplyFormData } from './supply-form-provider/hooks';
import type { ValidateRecipientArgs } from 'utils/zod-validation';

export type SupplyFormDataValidationContext = {
  ethBalance: bigint;
  wethBalance: bigint;
  validateRecipientArgs: ValidateRecipientArgs;
};

export type SupplyFormDataAwaitableValidationContext =
  Promise<SupplyFormDataValidationContext>;

export type SupplyFormValidatedValues = z.infer<
  ReturnType<typeof supplyFormSchema>
>;

export type SupplyFormFieldValues = {
  // booleans as is
  token: SupplyFormValidatedValues['token'];
  mintSteth: SupplyFormValidatedValues['mintSteth'];
  //  will be validated to correct types
  amount: bigint | null;
  mintAddress: string;
};

// underlying type is too complex
export type SupplyFormData = ReturnType<typeof useSupplyFormData>;
