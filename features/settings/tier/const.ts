import { z } from 'zod';
import { FieldErrors, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { vaultTexts } from 'modules/vaults/consts';
import { TierSettingsFormValues } from './types';
import { NodeOperatorTiersData, VaultTierData } from './hooks';

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
          data.vaultMintingLimit,
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
  Promise<[VaultTierData, NodeOperatorTiersData]>,
  TierSettingsFormValues
> = async (values, awaitableContext, options) => {
  const baseResult = await baseTierValidation(values, undefined, options);
  const context = await awaitableContext;

  if (context) {
    const [vaultTierData, noTiersData] = context;
    if (Object.keys(baseResult.errors).length > 0) return baseResult;

    if (vaultTierData.vault.liabilityStETH > values.vaultMintingLimit) {
      (
        baseResult.errors as FieldErrors<TierSettingsFormValues>
      ).vaultMintingLimit = {
        type: 'custom',
        message: `Value less than Vault liability`,
      };

      return baseResult;
    }
    const selectedTier = noTiersData.tiers.find(
      (tier) => tier.id === BigInt(values.selectedTierId),
    );
    if (!selectedTier) return baseResult;

    const availableStETH =
      selectedTier.shareLimitStETH - selectedTier.liabilityStETH;
    if (values.vaultMintingLimit > availableStETH) {
      (
        baseResult.errors as FieldErrors<TierSettingsFormValues>
      ).vaultMintingLimit = {
        type: 'custom',
        message: `Remaining Tier capacity is less than the Vault liability`,
      };
    }
  }

  return baseResult;
};
