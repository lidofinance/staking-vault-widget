import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import {
  maxAmountSchema,
  validateRecipientSchema,
  supplyTokenSchema,
} from 'utils/zod-validation';

import type {
  FundFormDataAwaitableValidationContext,
  FundFormDataValidationContext,
  FundFormFieldValues,
  FundFormValidatedValues,
} from '../types';

type FundFormSchemaOptions = FundFormDataValidationContext & {
  mintSteth: boolean;
  isETH: boolean;
};

export const fundFormSchema = ({
  isETH,
  ethBalance,
  wethBalance,
  validateRecipientArgs,
}: FundFormSchemaOptions) => {
  const mintSchema = z.discriminatedUnion('mintSteth', [
    z.object({
      mintSteth: z.literal(true),
      mintAddress: validateRecipientSchema(validateRecipientArgs),
    }),
    z.object({
      mintSteth: z.literal(false),
      mintAddress: z.unknown(),
    }),
  ]);

  const maxAmount = isETH ? ethBalance : wethBalance;

  return z.intersection(
    z.object({
      amount: maxAmountSchema(maxAmount),
      token: supplyTokenSchema,
    }),
    mintSchema,
  );
};

export const FundFormResolver: Resolver<
  FundFormFieldValues,
  FundFormDataAwaitableValidationContext,
  FundFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[FundFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);
  const schema = fundFormSchema({
    ...contextValue,
    isETH: values.token === 'ETH',
    mintSteth: values.mintSteth,
  });
  return zodResolver<
    FundFormFieldValues,
    FundFormDataAwaitableValidationContext,
    FundFormValidatedValues
  >(schema as any)(values, context, options);
};
