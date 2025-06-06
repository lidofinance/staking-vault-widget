import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import {
  addressSchema,
  amountSchema,
  supplyTokenSchema,
} from 'utils/validate-form-value';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import { vaultTexts } from 'modules/vaults';

import type {
  WithdrawFormFieldValues,
  WithdrawFormValidatedValues,
  WithdrawFormValidationContextAwaitable,
} from '../types';

export const WithdrawFormSchema = z.object({
  amount: amountSchema,
  token: supplyTokenSchema,
  recipient: addressSchema,
});

const baseValidation = zodResolver<
  WithdrawFormFieldValues,
  unknown,
  WithdrawFormValidatedValues
>(
  WithdrawFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const withdrawFormResolver: Resolver<
  WithdrawFormFieldValues,
  WithdrawFormValidationContextAwaitable,
  WithdrawFormValidatedValues
> = async (values, context, options) => {
  // validate base schema that does not require context
  const baseResult = await baseValidation(values, context, options as any);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;
  // errors are empty, so we can safely cast values to validated type
  const { amount } = baseResult.values as WithdrawFormValidatedValues;

  // validate context-dependent fields manually
  invariant(context, '[WithdrawFormResolver] context is undefined');
  const { withdrawableEther } = await awaitWithTimeout(context, 4000);

  if (amount > withdrawableEther) {
    return {
      values: {},
      errors: {
        amount: {
          type: 'max',
          message: vaultTexts.common.errors.amount.max(withdrawableEther),
        },
      },
    };
  }

  return {
    values: baseResult.values,
    errors: {},
  };
};
