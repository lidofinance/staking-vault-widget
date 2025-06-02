import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import { addressSchema } from 'utils/validate-form-value';
import { vaultTexts } from 'modules/vaults';

export type FundFormDataValidationContext = {
  ethBalance: bigint;
  wethBalance: bigint;
};

const mintSchema = z.discriminatedUnion('mintSteth', [
  z.object({
    mintSteth: z.literal(true),
    mintAddress: addressSchema,
  }),
  z.object({
    mintSteth: z.literal(false),
    mintAddress: z.any(),
  }),
]);

export const FundFormSchema = z.intersection(
  z.object({
    amount: z
      .bigint({ message: vaultTexts.common.errors.amount.required })
      .min(1n, vaultTexts.common.errors.amount.min(0n)),
    token: z.enum(['ETH', 'wETH']),
  }),
  mintSchema,
);

export type FundFormSchemaType = z.infer<typeof FundFormSchema>;

const baseValidation = zodResolver(
  FundFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const FundFormResolver: Resolver<
  FundFormSchemaType,
  Promise<FundFormDataValidationContext>
> = async (values, context, options) => {
  // validate base schema that does not require context
  const baseResult = await baseValidation(values, context, options as any);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;

  // validate context-dependent fields manually
  invariant(context, '[FundFormResolver] context is undefined');
  const { ethBalance, wethBalance } = await awaitWithTimeout(context, 4000);

  const { token, amount } = values;

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
