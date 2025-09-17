import { z } from 'zod';
import { FieldErrors, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Abi, Address, getAddress } from 'viem';
import invariant from 'tiny-invariant';

import { vaultTexts } from 'modules/vaults/consts';
import { awaitWithTimeout } from 'utils/await-with-timeout';
import { Confirmation, getConfirmationsInfo } from 'utils/get-confirmations';
import type { RegisteredPublicClient } from 'modules/web3';

import type { TierSettingsFormValues } from './types';
import type { VaultTierData } from './hooks';

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
  if (context && context.vault.liabilityStETH >= values.vaultMintingLimit) {
    (
      baseResult.errors as FieldErrors<TierSettingsFormValues>
    ).vaultMintingLimit = {
      type: 'custom',
      message:
        vaultTexts.actions.tier.vaultMintingLimit.errors.lessThanVaultLiability,
    };

    return baseResult;
  }

  return baseResult;
};

export const getVaultTierConfirmation = async (
  address: Address,
  publicClient: RegisteredPublicClient,
  abi: Abi,
  vaultAddress: Address,
): Promise<{
  confirmExpiry: bigint;
  proposedVaultLimit: bigint;
  lastProposal: Confirmation | undefined;
}> => {
  const { confirmations, confirmExpiry } = await getConfirmationsInfo(
    address,
    publicClient,
    abi,
  );

  const lastProposal = confirmations.findLast(
    ({ decodedData }) =>
      getAddress(decodedData.args[0] as Address) === getAddress(vaultAddress),
  );
  const proposedVaultLimit = lastProposal?.decodedData.args[2] ?? 0n;

  return {
    confirmExpiry,
    proposedVaultLimit,
    lastProposal,
  };
};
