import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import { vaultTexts } from 'modules/vaults';
import { verificationConfirmSchema } from 'shared/components/banners/additional-verification';

import { getMaxRebalanceAmount } from 'features/rebalance/shared';

import type {
  RebalanceFormAwaitableValidationContext,
  RebalanceFormValidationContext,
  RebalanceFormFieldValues,
  RebalanceFormValidatedValues,
} from 'features/rebalance/types';

export const rebalanceFormSchema = (
  context: RebalanceFormValidationContext,
  isSupplyEth: boolean,
) => {
  const overviewData = context?.overviewData;
  const availableBalanceWei = overviewData?.availableBalanceWei ?? 0n;
  const vaultLiability = overviewData?.vaultLiabilityStETH ?? 0n;
  const isForceRebalance = overviewData?.isForceRebalance ?? false;
  const ethBalance = context?.ethBalance ?? 0n;
  const additionalVerification = {
    notOwner: false,
    multipleOwners: false,
    unguaranteedDeposits: false,
    ...context?.additionalVerification,
    // withdrawal permission is only risky when this rebalance actually supplies ETH
    withdrawalPermission:
      (context?.additionalVerification?.withdrawalPermission ?? false) &&
      isSupplyEth,
  };

  const mainSchema = z
    .object({
      rebalanceAmount: z.bigint().nullable(),
      isSupplyEth: z.boolean(),
      supplyEth: z.bigint().nullable(),
    })
    .superRefine((data, ctx) => {
      if (isForceRebalance) return;

      if (data.isSupplyEth) {
        if (!data.supplyEth || data.supplyEth <= 0n) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: vaultTexts.common.errors.amount.required,
            path: ['supplyEth'],
          });
        } else if (data.supplyEth > ethBalance) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: vaultTexts.common.errors.amount.max(ethBalance),
            path: ['supplyEth'],
          });
        }
      }

      const supplyEthValue = data.isSupplyEth ? data.supplyEth ?? 0n : 0n;
      const maxRebalanceAmount = getMaxRebalanceAmount({
        availableBalance: availableBalanceWei,
        vaultLiability,
        supplyEth: supplyEthValue,
      });

      if (!data.rebalanceAmount || data.rebalanceAmount <= 0n) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: vaultTexts.common.errors.amount.required,
          path: ['rebalanceAmount'],
        });
      } else if (data.rebalanceAmount > maxRebalanceAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: vaultTexts.common.errors.amount.max(maxRebalanceAmount),
          path: ['rebalanceAmount'],
        });
      }
    })
    .transform((data) => ({
      ...data,
      rebalanceAmount: data.rebalanceAmount ?? 0n,
      supplyEth: data.isSupplyEth ? data.supplyEth ?? 0n : 0n,
    }));

  return z.intersection(
    mainSchema,
    isForceRebalance
      ? z.object({})
      : verificationConfirmSchema(additionalVerification),
  );
};

// tracks context promises that already timed out once, so repeated
// validation calls (e.g. mode: 'onChange') don't re-wait 10s each time
// for a promise that is known to never settle (e.g. vault disconnected)
const timedOutContexts = new WeakSet<RebalanceFormAwaitableValidationContext>();

export const RebalanceFormResolver: Resolver<
  RebalanceFormFieldValues,
  RebalanceFormAwaitableValidationContext,
  RebalanceFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[RebalanceFormResolver] context is undefined');

  const contextValue = timedOutContexts.has(context)
    ? undefined
    : await awaitWithTimeout(context, 10000).catch(() => {
        timedOutContexts.add(context);
        return undefined;
      });

  const schema = rebalanceFormSchema(contextValue, values.isSupplyEth);
  return zodResolver<
    RebalanceFormFieldValues,
    RebalanceFormAwaitableValidationContext,
    RebalanceFormValidatedValues
  >(schema as any)(values, context, options);
};
