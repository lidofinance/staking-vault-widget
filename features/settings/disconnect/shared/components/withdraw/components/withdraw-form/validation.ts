import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Address, isAddressEqual } from 'viem';

import { vaultTexts } from 'modules/vaults';
import { addressSchema } from 'utils/zod-validation';

import type {
  DisconnectWithdrawFormFieldValues,
  DisconnectWithdrawFormValidatedValues,
} from './types';

export const disconnectWithdrawFormSchema = (vaultAddress: Address) =>
  z.object({
    useOwnerAddress: z.boolean(),
    recipient: addressSchema.refine(
      (value) => !isAddressEqual(value, vaultAddress),
      { message: vaultTexts.common.errors.address.vault },
    ),
  });

export const disconnectWithdrawFormResolver = (vaultAddress: Address) =>
  zodResolver<
    DisconnectWithdrawFormFieldValues,
    unknown,
    DisconnectWithdrawFormValidatedValues
  >(disconnectWithdrawFormSchema(vaultAddress));
