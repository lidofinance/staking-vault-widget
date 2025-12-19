import { z } from 'zod';
import type { FieldErrors, Resolver, ResolverResult } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import invariant from 'tiny-invariant';
import { type Address, isAddressEqual } from 'viem';

import { vaultTexts, type VaultTierData } from 'modules/vaults';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type { TierSettingsFormValues } from './types';

export const tierSettingsFormSchema = z
  .object({
    selectedTierId: z.string(),
    selectedTierLimit: z.bigint(),
    vaultMintingLimit: z
      .bigint({ message: vaultTexts.common.errors.amount.required })
      .min(1n, vaultTexts.common.errors.amount.min(0n)),
  })
  .superRefine((data, ctx) => {
    if (data.vaultMintingLimit > data.selectedTierLimit) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: data.selectedTierLimit,
        inclusive: true,
        type: 'bigint',
        path: ['vaultMintingLimit'],
        message: vaultTexts.actions.tier.inputMintingLimit.errors.max(
          data.selectedTierLimit,
        ),
      });
    }
  });

const baseTierValidation = zodResolver<
  TierSettingsFormValues,
  unknown,
  TierSettingsFormValues
>(
  tierSettingsFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const tierSettingsFormResolver: Resolver<
  TierSettingsFormValues,
  Promise<VaultTierData>,
  TierSettingsFormValues
> = async (values, awaitableContext, options) => {
  const baseResult = await baseTierValidation(values, undefined, options);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;

  invariant(
    awaitableContext,
    '[tierSettingsFormResolver] context is undefined',
  );

  const context = await awaitWithTimeout(awaitableContext, 5000);

  if (!context) {
    return baseResult;
  }

  const errors = baseResult.errors as FieldErrors<TierSettingsFormValues>;

  if (context.vault.liabilityStETH >= values.vaultMintingLimit) {
    errors.vaultMintingLimit = {
      type: 'custom',
      message:
        vaultTexts.actions.tier.vaultMintingLimit.errors.lessThanVaultLiability,
    };
  }

  if (
    context.vault.stETHLimit === values.vaultMintingLimit &&
    String(context.vault.tierId) === values.selectedTierId
  ) {
    errors.vaultMintingLimit = {
      type: 'custom',
      message: vaultTexts.actions.tier.vaultMintingLimit.errors.alreadySet,
    };
  }

  if (Object.keys(errors).length > 0) {
    return {
      values: {},
      errors,
    } as ResolverResult<TierSettingsFormValues, TierSettingsFormValues>;
  }

  return {
    values,
    errors: {},
  } as ResolverResult<TierSettingsFormValues, TierSettingsFormValues>;
};

export const checkUserIsProposer = (
  dashboard: Address | undefined,
  proposer: Address | undefined,
) => {
  if (!dashboard || !proposer) {
    return false;
  }

  return isAddressEqual(dashboard, proposer);
};

export const ALTER_TIER_LABELS = {
  reserveRatio: 'Reserve Ratio',
  forcedRebalanceThreshold: 'Forced Rebalance Threshold',
  infraFee: 'Infra Fee',
  liquidityFee: 'Liquidity Fee',
  reservationFee: 'Reservation Fee',
};
