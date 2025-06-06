import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import {
  addressSchema,
  amountSchema,
  supplyTokenSchema,
} from 'utils/validate-form-value';
import { vaultTexts } from 'modules/vaults';

import type {
  FundFormDataAwaitableValidationContext,
  FundFormFieldValues,
  FundFormValidatedValues,
} from '../types';

const mintSchema = z.discriminatedUnion('mintSteth', [
  z.object({
    mintSteth: z.literal(true),
    mintAddress: addressSchema,
  }),
  z.object({
    mintSteth: z.literal(false),
    mintAddress: z.unknown(),
  }),
]);

export const FundFormSchema = z.intersection(
  z.object({
    amount: amountSchema,
    token: supplyTokenSchema,
  }),
  mintSchema,
);

const baseValidation = zodResolver<
  FundFormFieldValues,
  FundFormDataAwaitableValidationContext,
  FundFormValidatedValues
>(
  // @ts-expect-error zodResolver types don't correctly han
  FundFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const FundFormResolver: Resolver<
  FundFormFieldValues,
  FundFormDataAwaitableValidationContext,
  FundFormValidatedValues
> = async (values, context, options) => {
  // validate base schema that does not require context
  const baseResult = await baseValidation(values, context, options as any);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;
  // errors are empty, so we can safely cast values to validated type
  const { token, amount } = baseResult.values as FundFormValidatedValues;

  // validate context-dependent fields manually
  invariant(context, '[FundFormResolver] context is undefined');
  const { ethBalance, wethBalance } = await awaitWithTimeout(context, 4000);

  const balance = token === 'ETH' ? ethBalance : wethBalance;

  if (amount > balance) {
    return {
      values: {},
      errors: {
        amount: {
          type: 'max',
          message: vaultTexts.common.errors.amount.overBalance(token),
        },
      },
    };
  }

  return {
    values: baseResult.values,
    errors: {},
  };
};
