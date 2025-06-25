import { z } from 'zod';

import { VAULTS_NO_ROLES_MAP, VAULTS_OWNER_ROLES_MAP } from 'modules/vaults';
import { PermissionKeys } from './types';
import { addressSchema } from 'utils/validate-form-value';

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

export const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
export const DUPLICATED_ADDRESS_MESSAGE = 'Address already exists';

const addressEntrySchema = z.object({
  action: z.union([
    z.literal('display'),
    z.literal('revoke'),
    z.literal('grant'),
  ]),
  account: addressSchema,
});

export const EDITABLE_ROLES_LIST = Object.keys({
  ...VAULTS_OWNER_ROLES_MAP,
  ...VAULTS_NO_ROLES_MAP,
} as const) as (
  | keyof typeof VAULTS_OWNER_ROLES_MAP
  | keyof typeof VAULTS_NO_ROLES_MAP
)[];

export const editPermissionsSchema = z.object(
  Object.fromEntries(
    EDITABLE_ROLES_LIST.map((key) => [
      key,
      z.array(addressEntrySchema).optional(),
    ]),
  ) as {
    [key in PermissionKeys]: z.ZodOptional<
      z.ZodArray<typeof addressEntrySchema>
    >;
  },
);
