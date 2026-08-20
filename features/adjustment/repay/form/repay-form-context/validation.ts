import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';

import { maxAmountSchema, mintTokenSchema } from 'utils/zod-validation';
import { awaitWithTimeout } from 'utils/await-with-timeout';
import { verificationConfirmSchema } from 'shared/components/banners/additional-verification/validation';

import type {
  RepayFormFieldValues,
  RepayFormValidatedValues,
  RepayFormValidationContext,
  RepayFormValidationContextAwaitable,
} from '../types';

export const repayFormSchema = (
  context: RepayFormValidationContext,
  { isSteth }: { isSteth: boolean },
) => {
  const maxRepayableStETH = context?.maxRepayableStETH ?? 0n;
  const maxRepayableWstETH = context?.maxRepayableWstETH ?? 0n;
  const additionalVerification = context?.additionalVerification ?? {
    notOwner: false,
    multipleOwners: false,
    unguaranteedDeposits: false,
  };

  return z.intersection(
    z.object({
      amount: maxAmountSchema(isSteth ? maxRepayableStETH : maxRepayableWstETH),

      token: mintTokenSchema,
    }),
    verificationConfirmSchema(additionalVerification),
  );
};

// tracks context promises that already timed out once, so repeated
// validation calls don't re-wait 4s each time for a promise that is
// known to never settle (e.g. vault disconnected, dashboard unreadable)
const timedOutContexts = new WeakSet<RepayFormValidationContextAwaitable>();

export const repayFormResolver: Resolver<
  RepayFormFieldValues,
  RepayFormValidationContextAwaitable,
  RepayFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[repayFormResolver] context is undefined');

  const contextValue = timedOutContexts.has(context)
    ? undefined
    : await awaitWithTimeout(context, 4000).catch(() => {
        timedOutContexts.add(context);
        return undefined;
      });

  const schema = repayFormSchema(contextValue, {
    isSteth: values.token === 'stETH',
  });

  return zodResolver<RepayFormFieldValues, unknown, RepayFormValidatedValues>(
    schema,
  )(values, context, options);
};
