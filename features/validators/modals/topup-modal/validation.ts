import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { maxAmountSchema, pubkeySchema } from 'utils/zod-validation';
import { bigIntMin } from 'utils/bigint-math';
import { WEI_PER_ETHER } from 'consts/tx';

import type {
  TopUpFormFieldValues,
  TopUpFormValidatedValues,
  TopUpFormValidationContext,
} from './types';

const PREDEPOSIT_AMOUNT = WEI_PER_ETHER; // predeposit amount === 1 eth
const ACTIVATION_DEPOSIT_AMOUNT = 31n * WEI_PER_ETHER; // amount of ether to be deposited after the predeposit to activate the validator
const MAX_TOPUP_AMOUNT =
  2048n * WEI_PER_ETHER - ACTIVATION_DEPOSIT_AMOUNT - PREDEPOSIT_AMOUNT;

export const topUpFormSchema = ({
  availableBalance,
}: TopUpFormValidationContext) => {
  const maxAmount = bigIntMin(availableBalance, MAX_TOPUP_AMOUNT);
  return z.object({
    amount: maxAmountSchema(maxAmount),
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
