import type z from 'zod';
import type { claimFormSchema } from './claim-form-context/validation';
import type { ValidateRecipientArgs } from 'utils/validate-form-value';

export type ClaimFormValidatedValues = z.infer<
  ReturnType<typeof claimFormSchema>
>;

export type ClaimFormFieldValues = {
  recipient: ClaimFormValidatedValues['recipient'] | string;
};

export type ClaimFormValidationContext = ValidateRecipientArgs;

export type ClaimFormValidationContextAwaitable =
  Promise<ClaimFormValidationContext>;
