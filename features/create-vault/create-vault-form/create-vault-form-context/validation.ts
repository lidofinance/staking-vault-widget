import { Address, isAddress } from 'viem';
import { z } from 'zod';
import { Resolver, UseFormGetValues } from 'react-hook-form';
import {
  MainSettingsKeys,
  PermissionKeys,
  VaultMainSettingsType,
  VaultPermissionsType,
} from 'features/create-vault/types';
import { isValidAnyAddress } from 'utils/address-validation';
import { isValidEns } from 'utils/ens';
import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  VAULTS_NO_ROLES_MAP,
  VAULTS_OWNER_ROLES_MAP,
  MIN_CONFIRM_EXPIRY,
  MAX_CONFIRM_EXPIRY,
} from 'modules/vaults';
import invariant from 'tiny-invariant';
import { VaultFactoryArgs } from 'types/vault';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Must be ${MAX_FEE_VALUE} or less`;
const INVALID_NUMBER_EXPIRY_MIN_MESSAGE = `Must be ${MIN_CONFIRM_EXPIRY} or above`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_MESSAGE = 'Only number is valid';
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };

const validateAddress = (value: string) => isValidAnyAddress(value);

const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE });

const roleKeys = [
  ...Object.keys(VAULTS_OWNER_ROLES_MAP),
  ...Object.keys(VAULTS_NO_ROLES_MAP),
];

export const createVaultSchema = z.object({
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
  defaultAdmin: addressSchema,
  roles: z.object(
    Object.fromEntries(
      roleKeys.map((key) => [key, z.array(addressSchema).optional()]),
    ) as unknown as {
      [key in PermissionKeys]: z.ZodOptional<z.ZodArray<z.ZodString>>;
    },
  ),
});

export type CreateVaultSchema = z.infer<typeof createVaultSchema>;

const JOINT_ROLE_MAP = { ...VAULTS_OWNER_ROLES_MAP, ...VAULTS_NO_ROLES_MAP };

export const formatCreateVaultData = (
  values: CreateVaultSchema,
): VaultFactoryArgs => {
  return {
    defaultAdmin: values.defaultAdmin as Address,
    nodeOperator: values.nodeOperator as Address,
    nodeOperatorManager: values.nodeOperatorManager as Address,
    nodeOperatorFeeBP: BigInt(values.nodeOperatorFeeBP),
    confirmExpiry: BigInt(values.confirmExpiry * 60 * 60),

    roles: Object.entries(values.roles).flatMap(([roleName, roleAddresses]) => {
      const roleHash = JOINT_ROLE_MAP[roleName as PermissionKeys];
      invariant(
        roleHash,
        `[formatCreateVaultData] no role hash found for ${roleName}`,
      );
      if (!roleAddresses) return [];
      return roleAddresses.map((address) => ({
        role: roleHash,
        account: address as Address,
      }));
    }),
  };
};

export const validatePermissions = (
  getValues: UseFormGetValues<Record<string, any>>,
): Resolver<{ roles: VaultPermissionsType }> => {
  return async (values) => {
    const roles = values.roles;
    const errors = { roles: {} } as {
      roles: Record<PermissionKeys, Record<number, { value: string }>>;
    };

    const keysList = Object.keys(values) as PermissionKeys[];

    keysList.forEach((key: PermissionKeys) => {
      const formKey = `roles.${key}`;
      const payload = roles[key] ?? [];
      errors.roles[key] = {};

      payload.forEach((field, index) => {
        const { value: currentValue } = field;

        if (!isAddress(currentValue)) {
          const isValid = isValidEns(currentValue);

          if (!isValid) {
            errors.roles[key][index] = {
              value: 'Invalid ethereum address',
            };
          }
        }

        const mainFormValues = getValues(formKey) as string[];
        const filtered = mainFormValues.filter(
          (value) => value === currentValue,
        );

        if (filtered.length > 0) {
          errors.roles[key][index] = {
            value: 'Address already added',
          };
        }
      });
    });

    return {
      values,
      errors,
    };
  };
};

export const validateMainSettings: Resolver<VaultMainSettingsType> = (
  values: VaultMainSettingsType,
) => {
  const errors = {} as Record<MainSettingsKeys, { message: string }>;
  const keysList = Object.keys(values) as MainSettingsKeys[];

  keysList.map((key: MainSettingsKeys) => {
    const payload = values[key];
    if (typeof payload === 'string') {
      const isValid = validateAddress(payload);
      if (!isValid) {
        errors[key] = {
          message: INVALID_ADDRESS_MESSAGE,
        };
      }
    }

    if (
      ['nodeOperatorFeeBP', 'confirmExpiry'].includes(key) &&
      typeof payload !== 'number'
    ) {
      errors[key] = {
        message: INVALID_NUMBER_DATA_MESSAGE,
      };
    }

    if (typeof payload === 'number') {
      if (key === 'nodeOperatorFeeBP') {
        if (payload < MIN_FEE_VALUE) {
          errors[key] = {
            message: INVALID_NUMBER_DATA_MESSAGE,
          };
        } else if (payload > MAX_FEE_VALUE) {
          errors[key] = {
            message: INVALID_NUMBER_MAX_MESSAGE,
          };
        }
      }

      if (key === 'confirmExpiry') {
        if (payload < MIN_CONFIRM_EXPIRY) {
          errors[key] = {
            message: INVALID_NUMBER_EXPIRY_MIN_MESSAGE,
          };
        }

        if (payload > MAX_CONFIRM_EXPIRY) {
          errors[key] = {
            message: INVALID_NUMBER_EXPIRY_MAX_MESSAGE,
          };
        }
      }
    }
  });

  return {
    values,
    errors,
  };
};
