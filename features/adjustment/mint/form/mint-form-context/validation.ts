import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import {
  addressSchema,
  amountSchema,
  mintTokenSchema,
} from 'utils/validate-form-value';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import {
  MintFormFieldValues,
  MintFormValidatedValues,
  MintFormValidationContextAwaitable,
} from '../types';

export const mintFormSchema = z.object({
  amount: amountSchema,
  token: mintTokenSchema,
  recipient: addressSchema,
});

const baseValidation = zodResolver<
  MintFormFieldValues,
  unknown,
  MintFormValidatedValues
>(
  mintFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const mintFormResolver: Resolver<
  MintFormFieldValues,
  MintFormValidationContextAwaitable,
  MintFormValidatedValues
> = async (values, context, options) => {
  // validate base schema that does not require context
  const baseResult = await baseValidation(values, context, options as any);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;
  // errors are empty, so we can safely cast values to validated type
  const { token, amount } = baseResult.values as MintFormValidatedValues;

  // validate context-dependent fields manually
  invariant(context, '[MintFormResolver] context is undefined');
  const { mintableSteth, mintableWsteth } = await awaitWithTimeout(
    context,
    4000,
  );

  const maxAmount = token === 'stETH' ? mintableSteth : mintableWsteth;

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
