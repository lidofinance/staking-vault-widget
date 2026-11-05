import { z } from 'zod';
import { isAddressEqual } from 'viem';
import type { FieldErrors, Resolver, ResolverResult } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import invariant from 'tiny-invariant';

import {
  vaultTexts,
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
} from 'modules/vaults';
import { addressSchema } from 'utils/zod-validation';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type { PermissionsFormData } from './hooks/use-permissions-form-data';
import type { EditPermissionsSchema, PermissionKeys } from './types';

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

export const editPermissionsSchema = z.object({
  rolesSchema: z.object(
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
  ),
  noGuarantor: addressSchema,
  noDepositor: addressSchema,
});

const baseValidation = zodResolver<
  EditPermissionsSchema,
  unknown,
  EditPermissionsSchema
>(editPermissionsSchema, { async: false }, { mode: 'sync', raw: false });

export const editPermissionsResolver: Resolver<
  EditPermissionsSchema,
  Promise<PermissionsFormData>,
  EditPermissionsSchema
> = async (values, awaitableContext, options) => {
  const baseResult = await baseValidation(values, undefined, options);
  if (Object.keys(baseResult.errors).length > 0) return baseResult;

  invariant(awaitableContext, '[editPermissionsResolver] context is undefined');

  const context = await awaitWithTimeout(awaitableContext, 5000);

  if (!context) {
    return baseResult;
  }

  const { formValues, noBalanceLocked } = context;

  // PDG reverts `setNodeOperatorGuarantor` with `LockedIsNotZero`
  if (
    noBalanceLocked > 0n &&
    !isAddressEqual(values.noGuarantor, formValues.noGuarantor)
  ) {
    const errors: FieldErrors<EditPermissionsSchema> = {
      noGuarantor: {
        type: 'custom',
        message: vaultTexts.roles.guarantor.lockedError(noBalanceLocked),
      },
    };

    return {
      values: {},
      errors,
    } as ResolverResult<EditPermissionsSchema, EditPermissionsSchema>;
  }

  return baseResult;
};
