import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { maxAmountSchema, pubkeySchema } from 'utils/zod-validation';

import type {
  TopUpFormFieldValues,
  TopUpFormValidatedValues,
  TopUpFormValidationContext,
} from './types';

export const topUpFormSchema = ({
  availableBalance,
}: TopUpFormValidationContext) => {
  return z.object({
    amount: maxAmountSchema(availableBalance),
    index: z.number(),
    pubkey: pubkeySchema,
  });
};

export const topUpFormResolver: Resolver<
  TopUpFormFieldValues,
  TopUpFormValidationContext,
  TopUpFormValidatedValues
> = (values, context, options) => {
  invariant(context, '[topUpFormResolver] context is undefined');

  const schema = topUpFormSchema({
    ...context,
  });

  return zodResolver<TopUpFormFieldValues, unknown, TopUpFormValidatedValues>(
    schema,
  )(values, context, options);
};
