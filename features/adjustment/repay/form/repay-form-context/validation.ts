import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import { amountSchema, mintTokenSchema } from 'utils/validate-form-value';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  RepayFormFieldValues,
  RepayFormValidatedValues,
  RepayFormValidationContextAwaitable,
} from '../types';

export const repayFormSchema = z.object({
  amount: amountSchema,
  token: mintTokenSchema,
});

const baseValidation = zodResolver<
  RepayFormFieldValues,
  unknown,
  RepayFormValidatedValues
>(
  repayFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const repayFormResolver: Resolver<
  RepayFormFieldValues,
  RepayFormValidationContextAwaitable,
  RepayFormValidatedValues
> = async (values, context, options) => {
  // validate base schema that does not require context
  const baseResult = await baseValidation(values, context, options as any);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;
  // errors are empty, so we can safely cast values to validated type
  const { token, amount } = baseResult.values as RepayFormValidatedValues;

  // validate context-dependent fields manually
  invariant(context, '[repayFormResolver] context is undefined');
  const { maxRepayableStETH, maxRepayableWstETH } = await awaitWithTimeout(
    context,
    4000,
  );

  const maxAmount = token === 'stETH' ? maxRepayableStETH : maxRepayableWstETH;

  if (amount > maxAmount) {
    return {
      values: {},
      errors: {
        amount: {
          type: 'max',
          message: vaultTexts.common.errors.amount.max(maxAmount),
        },
      },
    };
  }

  return {
    values: baseResult.values,
    errors: {},
  };
};
