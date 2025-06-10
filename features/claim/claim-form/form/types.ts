import type z from 'zod';
import { claimFormSchema } from './claim-form-context/validation';

export type ClaimFormValidatedValues = z.infer<typeof claimFormSchema>;

export type ClaimFormFieldValues = {
  recipient: ClaimFormValidatedValues['recipient'] | string;
};
