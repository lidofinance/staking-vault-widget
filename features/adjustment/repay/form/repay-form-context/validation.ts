import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';

import { maxAmountSchema, mintTokenSchema } from 'utils/validate-form-value';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  RepayFormFieldValues,
  RepayFormValidatedValues,
  RepayFormValidationContext,
  RepayFormValidationContextAwaitable,
} from '../types';

type RepayFormSchemaOptions = RepayFormValidationContext & {
  isSteth: boolean;
};
export const repayFormSchema = ({
  isSteth,
  maxRepayableStETH,
  maxRepayableWstETH,
}: RepayFormSchemaOptions) =>
  z.object({
    amount: maxAmountSchema(isSteth ? maxRepayableStETH : maxRepayableWstETH),

    token: mintTokenSchema,
  });

export const repayFormResolver: Resolver<
  RepayFormFieldValues,
  RepayFormValidationContextAwaitable,
  RepayFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[repayFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);
  const schema = repayFormSchema({
    ...contextValue,
    isSteth: values.token === 'stETH',
  });

  return zodResolver<RepayFormFieldValues, unknown, RepayFormValidatedValues>(
    schema,
  )(values, context, options);
};
