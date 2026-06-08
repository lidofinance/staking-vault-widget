import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import { vaultTexts } from 'modules/vaults';
import { verificationConfirmSchema } from 'shared/components/banners/additional-verification';

import {
  getRebalanceMode,
  getMaxRebalanceAmount,
} from 'features/rebalance/shared';

import type {
  RebalanceFormAwaitableValidationContext,
  RebalanceFormValidationContext,
  RebalanceFormFieldValues,
  RebalanceFormValidatedValues,
} from 'features/rebalance/types';

export const rebalanceFormSchema = (
  context: RebalanceFormValidationContext,
) => {
  const overviewData = context?.overviewData;
  const availableBalanceWei = overviewData?.availableBalanceWei ?? 0n;
  const vaultLiability = overviewData?.vaultLiability ?? 0n;
  const ethBalance = context?.ethBalance ?? 0n;
  const additionalVerification = context?.additionalVerification ?? {
    notOwner: false,
    multipleOwners: false,
    unguaranteedDeposits: false,
  };

  // Rebalancing is available whenever there is an outstanding stETH Liability:
  // either the forced rebalance shortfall has to be covered, or the user
  // voluntarily repays (part of) the liability. Otherwise there is nothing to
  // rebalance.
  const mode = getRebalanceMode({
    vaultLiability,
    healthFactorNumber: overviewData?.healthFactorNumber,
  });

  const mainSchema = z
    .object({
      isSupplyEth: z.boolean(),
      supplyEth: z.bigint().nullable(),
      rebalanceAmount: z.bigint().nullable(),
    })
    .superRefine((data, ctx) => {
      if (mode === 'none') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No rebalance needed',
          path: ['rebalanceAmount'],
        });
        return;
      }

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
        mode,
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
    verificationConfirmSchema(additionalVerification),
  );
};

export const RebalanceFormResolver: Resolver<
  RebalanceFormFieldValues,
  RebalanceFormAwaitableValidationContext,
  RebalanceFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[RebalanceFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 10000);
  const schema = rebalanceFormSchema(contextValue);
  return zodResolver<
    RebalanceFormFieldValues,
    RebalanceFormAwaitableValidationContext,
    RebalanceFormValidatedValues
  >(schema as any)(values, context, options);
};
