import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import {
  maxAmountSchema,
  mintTokenSchema,
  validateRecipientSchema,
} from 'utils/zod-validation';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  MintFormFieldValues,
  MintFormValidatedValues,
  MintFormValidationContext,
  MintFormValidationContextAwaitable,
} from '../types';

type SchemaOptions = MintFormValidationContext & { isSteth: boolean };

export const mintFormSchema = ({
  mintableStETH,
  mintableWstETH,
  validateRecipientArgs,
  isSteth,
}: SchemaOptions) => {
  const maxAmount = isSteth ? mintableStETH : mintableWstETH;

  return z.object({
    amount: maxAmountSchema(maxAmount),
    token: mintTokenSchema,
    recipient: validateRecipientSchema(validateRecipientArgs),
  });
};

export const mintFormResolver: Resolver<
  MintFormFieldValues,
  MintFormValidationContextAwaitable,
  MintFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[MintFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);

  const schema = mintFormSchema({
    ...contextValue,
    isSteth: values.token === 'stETH',
  });

  return zodResolver<MintFormFieldValues, unknown, MintFormValidatedValues>(
    schema,
  )(values, context, options);
};
