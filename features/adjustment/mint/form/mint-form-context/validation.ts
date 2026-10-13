import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zeroAddress } from 'viem';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import {
  maxAmountSchema,
  mintTokenSchema,
  validateRecipientSchema,
} from 'utils/zod-validation';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  MintFormFieldValues,
  MintFormValidatedValues,
  MintFormValidationContext,
  MintFormValidationContextAwaitable,
} from '../types';

export const mintFormSchema = (
  context: MintFormValidationContext,
  { isSteth }: { isSteth: boolean },
) => {
  const mintableStETH = context?.mintableStETH ?? 0n;
  const mintableWstETH = context?.mintableWstETH ?? 0n;
  const validateRecipientArgs = context?.validateRecipientArgs ?? {
    vaultAddress: zeroAddress,
    dashboardAddress: zeroAddress,
  };

  const maxAmount = isSteth ? mintableStETH : mintableWstETH;

  return z.object({
    amount: maxAmountSchema(maxAmount),
    token: mintTokenSchema,
    recipient: validateRecipientSchema(validateRecipientArgs),
  });
};

// tracks context promises that already timed out once, so repeated
// validation calls don't re-wait 4s each time for a promise that is
// known to never settle (e.g. vault disconnected, dashboard unreadable)
const timedOutContexts = new WeakSet<MintFormValidationContextAwaitable>();

export const mintFormResolver: Resolver<
  MintFormFieldValues,
  MintFormValidationContextAwaitable,
  MintFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[MintFormResolver] context is undefined');

  const contextValue = timedOutContexts.has(context)
    ? undefined
    : await awaitWithTimeout(context, 4000).catch(() => {
        timedOutContexts.add(context);
        return undefined;
      });

  const schema = mintFormSchema(contextValue, {
    isSteth: values.token === 'stETH',
  });

  return zodResolver<MintFormFieldValues, unknown, MintFormValidatedValues>(
    schema,
  )(values, context, options);
};
