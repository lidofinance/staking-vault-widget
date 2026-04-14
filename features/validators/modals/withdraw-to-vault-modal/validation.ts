import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { maxAmountSchema, pubkeySchema } from 'utils/zod-validation';

import {
  WithdrawalFormFieldValues,
  WithdrawalFormValidatedValues,
  WithdrawalFormValidationContext,
} from './types';

export const withdrawalFormSchema = ({
  availableAmount,
}: WithdrawalFormValidationContext) => {
  return z.object({
    amount: maxAmountSchema(availableAmount),
    index: z.number(),
    pubkey: pubkeySchema,
  });
};

export const withdrawalFormResolver: Resolver<
  WithdrawalFormFieldValues,
  WithdrawalFormValidationContext,
  WithdrawalFormValidatedValues
> = (values, context, options) => {
  invariant(context, '[withdrawalFormResolver] context is undefined');

  const schema = withdrawalFormSchema({
    ...context,
  });

  return zodResolver<
    WithdrawalFormFieldValues,
    unknown,
    WithdrawalFormValidatedValues
  >(schema)(values, context, options);
};
