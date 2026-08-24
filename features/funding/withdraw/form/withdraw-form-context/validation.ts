import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zeroAddress } from 'viem';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import {
  maxAmountSchema,
  supplyTokenSchema,
  validateRecipientSchema,
} from 'utils/zod-validation';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  WithdrawFormFieldValues,
  WithdrawFormValidatedValues,
  WithdrawFormValidationContext,
  WithdrawFormValidationContextAwaitable,
} from '../types';

export const WithdrawFormSchema = (context: WithdrawFormValidationContext) => {
  const withdrawableEther = context?.withdrawableEther ?? 0n;
  const validateRecipientArgs = context?.validateRecipientArgs ?? {
    vaultAddress: zeroAddress,
    dashboardAddress: zeroAddress,
  };

  return z.object({
    amount: maxAmountSchema(withdrawableEther),
    token: supplyTokenSchema,
    recipient: validateRecipientSchema(validateRecipientArgs),
  });
};

// tracks context promises that already timed out once, so repeated
// validation calls don't re-wait 4s each time for a promise that is
// known to never settle (e.g. vault disconnected, dashboard unreadable)
const timedOutContexts = new WeakSet<WithdrawFormValidationContextAwaitable>();

export const withdrawFormResolver: Resolver<
  WithdrawFormFieldValues,
  WithdrawFormValidationContextAwaitable,
  WithdrawFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[WithdrawFormResolver] context is undefined');

  const contextValue = timedOutContexts.has(context)
    ? undefined
    : await awaitWithTimeout(context, 4000).catch(() => {
        timedOutContexts.add(context);
        return undefined;
      });

  const schema = WithdrawFormSchema(contextValue);

  return zodResolver<
    WithdrawFormFieldValues,
    unknown,
    WithdrawFormValidatedValues
  >(schema)(values, contextValue, options);
};
