import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';

import { Address } from 'viem';
import { permissionsKeys, permissions } from 'consts/roles';

export enum PermissionToggleEnum {
  byPermission = 'by_permission',
  byAddress = 'by_address',
}

export enum SubmitPermissionsStepEnum {
  edit = 'edit',
  initiate = 'initiate',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
}

export const permissionsToggleList = [
  {
    value: PermissionToggleEnum.byPermission,
    label: 'by Permission',
  },
  {
    value: PermissionToggleEnum.byAddress,
    label: 'by address',
  },
];

export type ToggleValue =
  (typeof PermissionToggleEnum)[keyof typeof PermissionToggleEnum];

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const validateAddress = (value: string) => isValidAnyAddress(value);
const accountSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((value) => value as Address);

const addressSchema = z.discriminatedUnion('group', [
  z.object({
    group: z.literal('eventual'),
    state: z.union([z.literal('restore'), z.literal('grant')]),
    account: accountSchema,
  }),
  z.object({
    group: z.literal('settled'),
    state: z.union([z.literal('remove'), z.literal('display')]),
    account: accountSchema,
  }),
]);

export const editPermissionsSchema = z.object(
  Object.fromEntries(
    permissionsKeys.map((key) => [key, z.array(addressSchema).optional()]),
  ) as unknown as {
    [key in keyof typeof permissions]: z.ZodOptional<
      z.ZodArray<typeof addressSchema>
    >;
  },
);
