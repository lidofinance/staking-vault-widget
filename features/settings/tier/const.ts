import { z } from 'zod';

import { vaultTexts } from 'modules/vaults/consts';

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
