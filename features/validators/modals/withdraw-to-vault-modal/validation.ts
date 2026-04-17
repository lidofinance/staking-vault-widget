import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { maxAmountSchema, pubkeySchema } from 'utils/zod-validation';
import { WEI_PER_GWEI } from 'consts/tx';

import {
  WithdrawalFormFieldValues,
  WithdrawalFormValidatedValues,
  WithdrawalFormValidationContext,
} from './types';

const amountStepError = 'Amount must be multiple of 1 gwei';

export const withdrawalFormSchema = ({
  availableAmount,
  isPartial,
}: WithdrawalFormValidationContext) => {
  return z.object({
    amount: isPartial
      ? maxAmountSchema(availableAmount).refine(
          (value) => value % WEI_PER_GWEI === 0n,
          amountStepError,
        )
      : z.literal(0n),
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
