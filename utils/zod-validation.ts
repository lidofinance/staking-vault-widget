import { z } from 'zod';
import { type Address, type Hex, isAddress, isAddressEqual, isHex } from 'viem';

import { vaultTexts } from 'modules/vaults/consts';

const validateAddress = (value: string | null) => !!(value && isAddress(value));
const validatePubkey = (value: string | null) =>
  !!(value && isHex(value) && value.length === 98);

export const addressSchema = z
  .string()
  .nonempty({
    message: vaultTexts.common.errors.address.required,
  })
  .trim()
  .transform((value) => value.toLocaleLowerCase() as Address)
  .refine(validateAddress, {
    message: vaultTexts.common.errors.address.invalid,
  }) as z.ZodType<Address>;

export const pubkeySchema = z
  .string()
  .nonempty({
    message: vaultTexts.common.errors.pubkey.required,
  })
  .trim()
  .transform((value) => value.toLocaleLowerCase() as Hex)
  .refine(validatePubkey, {
    message: vaultTexts.common.errors.pubkey.invalid,
  }) as z.ZodType<Hex>;

export const amountSchema = z
  .bigint({ message: vaultTexts.common.errors.amount.required })
  .min(1n, vaultTexts.common.errors.amount.min(0n));

export const supplyTokenSchema = z.enum(['ETH', 'wETH']);

export const mintTokenSchema = z.enum(['stETH', 'wstETH']);

export const maxAmountSchema = (maxAmount: bigint) =>
  amountSchema.lte(maxAmount, vaultTexts.common.errors.amount.max(maxAmount));

export type ValidateRecipientArgs = {
  vaultAddress: Address;
  dashboardAddress: Address;
};

export const validateRecipientSchema = ({
  dashboardAddress,
  vaultAddress,
}: ValidateRecipientArgs) =>
  addressSchema.pipe(
    z
      .string()
      .transform((value) => value as Address)
      .refine((val) => !isAddressEqual(val, vaultAddress), {
        message: vaultTexts.common.errors.address.vault,
      })
      .refine((val) => !isAddressEqual(val, dashboardAddress), {
        message: vaultTexts.common.errors.address.dashboard,
      }),
  );
