import z from 'zod';
import invariant from 'tiny-invariant';
import { zeroAddress } from 'viem';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import {
  amountSchema,
  maxAmountSchema,
  validateRecipientSchema,
  supplyTokenSchema,
} from 'utils/zod-validation';
import type { SupplyBalanceCheck } from './supply-resume';
import { verificationConfirmSchema } from 'shared/components/banners/additional-verification/validation';

import type {
  SupplyFormDataAwaitableValidationContext,
  SupplyFormDataValidationContext,
  SupplyFormFieldValues,
  SupplyFormValidatedValues,
} from '../types';

export const supplyFormSchema = (
  context: SupplyFormDataValidationContext,
  {
    isETH,
    balanceCheck = 'token',
  }: {
    isETH: boolean;
    // resume after a confirmed unwrap or fund checks the balance the resubmit
    // actually spends from, or none (see supply-resume)
    balanceCheck?: SupplyBalanceCheck;
  },
) => {
  const ethBalance = context?.ethBalance ?? 0n;
  const wethBalance = context?.wethBalance ?? 0n;
  const validateRecipientArgs = context?.validateRecipientArgs ?? {
    vaultAddress: zeroAddress,
    dashboardAddress: zeroAddress,
  };
  const additionalVerification = context?.additionalVerification ?? {
    notOwner: false,
    multipleOwners: false,
    unguaranteedDeposits: false,
    custodyPermission: false,
  };

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

  const maxAmount = isETH || balanceCheck === 'eth' ? ethBalance : wethBalance;

  return z.intersection(
    z.intersection(
      z.object({
        amount:
          balanceCheck === 'none' ? amountSchema : maxAmountSchema(maxAmount),
        token: supplyTokenSchema,
      }),
      mintSchema,
    ),
    verificationConfirmSchema(additionalVerification),
  );
};

// tracks context promises that already timed out once, so repeated
// validation calls don't re-wait 4s each time for a promise that is
// known to never settle (e.g. vault disconnected, dashboard unreadable)
const timedOutContexts =
  new WeakSet<SupplyFormDataAwaitableValidationContext>();

export const createSupplyFormResolver =
  (
    getBalanceCheck: (
      values: SupplyFormFieldValues,
    ) => SupplyBalanceCheck = () => 'token',
  ): Resolver<
    SupplyFormFieldValues,
    SupplyFormDataAwaitableValidationContext,
    SupplyFormValidatedValues
  > =>
  async (values, context, options) => {
    invariant(context, '[SupplyFormResolver] context is undefined');

    const contextValue = timedOutContexts.has(context)
      ? undefined
      : await awaitWithTimeout(context, 4000).catch(() => {
          timedOutContexts.add(context);
          return undefined;
        });

    const schema = supplyFormSchema(contextValue, {
      isETH: values.token === 'ETH',
      balanceCheck: getBalanceCheck(values),
    });
    return zodResolver<
      SupplyFormFieldValues,
      SupplyFormDataAwaitableValidationContext,
      SupplyFormValidatedValues
    >(schema as any)(values, context, options);
  };
