import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { maxAmountSchema, pubkeySchema } from 'utils/zod-validation';
import { WEI_PER_GWEI } from 'consts/tx';
import { formatBalance } from 'utils';

import {
  WithdrawalFormFieldValues,
  WithdrawalFormValidatedValues,
  WithdrawalFormValidationContext,
} from './types';

const amountGweiError = 'Value must be greater than 1 gwei';
const amountObligationError = (obligation: bigint) =>
  `Value must be greater than your obligation ${formatBalance(obligation).trimmed} ETH`;

export const withdrawalFormSchema = ({
  availableAmount,
  isPartial,
  obligationsShortfallValue,
}: WithdrawalFormValidationContext) => {
  return z.object({
    amount: isPartial
      ? maxAmountSchema(availableAmount)
          .refine((value) => value > WEI_PER_GWEI, amountGweiError)
          .refine(
            (value) => value > obligationsShortfallValue,
            amountObligationError(obligationsShortfallValue),
          )
      : z.literal(0n),
    index: z.number(),
    pubkey: pubkeySchema,
    validatorWithdrawalFee: z.bigint(),
    balance: z.bigint(),
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
