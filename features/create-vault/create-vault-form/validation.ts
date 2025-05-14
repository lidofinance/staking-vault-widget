import { Address } from 'viem';
import { z } from 'zod';
import { PermissionKeys } from 'features/create-vault/types';
import { isValidAnyAddress } from 'utils/address-validation';
import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
  MIN_CONFIRM_EXPIRY,
  MAX_CONFIRM_EXPIRY,
} from 'modules/vaults';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Must be ${MAX_FEE_VALUE} or less`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };
const INVALID_TERMS = 'You must accept the terms';

const validateAddress = (value: string | null) =>
  value && isValidAnyAddress(value);

const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((value) => value as Address);

const permissionSchema = z.object({
  state: z.union([z.literal('restore'), z.literal('grant')]),
  account: addressSchema,
});

const roleKeys = [
  ...Object.keys(VAULTS_OWNER_ROLES_MAP),
  ...Object.keys(VAULTS_NO_ROLES_MAP),
];

export const createVaultSchema = z.object({
  defaultAdmin: addressSchema,
  nodeOperator: addressSchema,
  nodeOperatorManager: addressSchema,

  nodeOperatorFeeBP: z
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
    .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE),
  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_MIN_MESSAGE)
    .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),

  acceptTerms: z.boolean().refine((accepted) => accepted, INVALID_TERMS),

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
