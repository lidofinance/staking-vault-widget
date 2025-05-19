import { Address } from 'viem';
import { z } from 'zod';

import { isValidAnyAddress } from 'utils/address-validation';
import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
  MIN_CONFIRM_EXPIRY,
  MAX_CONFIRM_EXPIRY,
  VAULT_TOTAL_BASIS_POINTS,
} from 'modules/vaults';

import type { PermissionKeys } from 'features/create-vault/types';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Must be ${MAX_FEE_VALUE} or less`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };
const INVALID_BASIS_POINTS_MESSAGE = {
  message: 'Min step 0.001%',
};

const INVALID_EMPTY_ADDRESS_ARRAY = {
  message: 'At least one address is required',
};
const INVALID_DUPE_ADDRESS_ARRAY = 'Duplicate addresses are not allowed';

const INVALID_TERMS = 'You must accept the terms';

const validateBasisPoints = (value: number) =>
  value * VAULT_TOTAL_BASIS_POINTS -
    Math.floor(value * VAULT_TOTAL_BASIS_POINTS) ===
  0;

const validateAddress = (value: string | null) =>
  value && isValidAnyAddress(value);

const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((value) => value.toLocaleLowerCase() as Address);

const permissionSchema = z.object({
  state: z.union([z.literal('restore'), z.literal('grant')]),
  account: addressSchema,
});

const uniqueAddressesSchema = z
  .array(z.object({ value: addressSchema }))
  .nonempty(INVALID_EMPTY_ADDRESS_ARRAY)
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (!item) return;
      const lastIndex = items.findLastIndex((i) => i.value === item.value);

      if (lastIndex !== index) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: INVALID_DUPE_ADDRESS_ARRAY,
          path: [lastIndex, 'value'],
        });
      }
    });
  });

const roleKeys = [
  ...Object.keys(VAULTS_OWNER_ROLES_MAP),
  ...Object.keys(VAULTS_NO_ROLES_MAP),
];

export const createVaultSchema = z.object({
  nodeOperator: addressSchema,
  vaultManager: uniqueAddressesSchema,
  nodeOperatorManager: addressSchema,

  nodeOperatorFeeBP: z
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
    .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE)
    .refine(validateBasisPoints, INVALID_BASIS_POINTS_MESSAGE),

  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_MIN_MESSAGE)
    .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),

  acceptTerms: z.boolean().refine((accepted) => accepted, INVALID_TERMS),

  step: z.number(),

  roles: z.object(
    Object.fromEntries(
      roleKeys.map((key) => [key, z.array(permissionSchema).optional()]),
    ) as unknown as {
      [key in PermissionKeys]: z.ZodOptional<
        z.ZodArray<typeof permissionSchema>
      >;
    },
  ),
});
