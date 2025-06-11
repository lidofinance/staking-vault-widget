import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { validateRecipientSchema } from 'utils/validate-form-value';

import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  ClaimFormFieldValues,
  ClaimFormValidatedValues,
  ClaimFormValidationContext,
  ClaimFormValidationContextAwaitable,
} from '../types';

export const claimFormSchema = (
  validationContext: ClaimFormValidationContext,
) =>
  z.object({
    recipient: validateRecipientSchema(validationContext),
  });

export const claimFormResolver: Resolver<
  ClaimFormFieldValues,
  ClaimFormValidationContextAwaitable,
  ClaimFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[repayFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);
  const schema = claimFormSchema(contextValue);

  return zodResolver<ClaimFormFieldValues, unknown, ClaimFormValidatedValues>(
    schema,
  )(values, context, options);
};
