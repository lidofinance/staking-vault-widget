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
  SupplyFormDataAwaitableValidationContext,
  SupplyFormDataValidationContext,
  SupplyFormFieldValues,
  SupplyFormValidatedValues,
} from '../types';

type SupplyFormSchemaOptions = SupplyFormDataValidationContext & {
  mintSteth: boolean;
  isETH: boolean;
};

export const supplyFormSchema = ({
  isETH,
  ethBalance,
  wethBalance,
  validateRecipientArgs,
}: SupplyFormSchemaOptions) => {
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

export const SupplyFormResolver: Resolver<
  SupplyFormFieldValues,
  SupplyFormDataAwaitableValidationContext,
  SupplyFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[SupplyFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);
  const schema = supplyFormSchema({
    ...contextValue,
    isETH: values.token === 'ETH',
    mintSteth: values.mintSteth,
  });
  return zodResolver<
    SupplyFormFieldValues,
    SupplyFormDataAwaitableValidationContext,
    SupplyFormValidatedValues
  >(schema as any)(values, context, options);
};
