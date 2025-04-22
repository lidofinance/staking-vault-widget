import { Address, isAddress } from 'viem';
import { z, ZodError, ZodSchema } from 'zod';
import {
  appendErrors,
  FieldError,
  Resolver,
  UseFormGetValues,
} from 'react-hook-form';
import { VaultFactoryArgs } from 'types';
import {
  MainSettingsKeys,
  PermissionKeys,
  VaultMainSettingsType,
  VaultPermissionsType,
} from 'features/create-vault/types';
import { isValidAnyAddress } from 'utils/address-validation';
import { isValidEns } from 'utils/ens';
import { VAULTS_NO_ROLES_MAP, VAULTS_OWNER_ROLES_MAP } from 'modules/vaults';
import invariant from 'tiny-invariant';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = 'Must be 0.001 or above';
const INVALID_NUMBER_MAX_MESSAGE = 'Must be 99 or less';
const INVALID_NUMBER_SUM_MESSAGE =
  "Sum of Curator's and Node Operator's fees can't be more than 100";
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = 'Must be 800 or less';
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
  assetRecoverer: addressSchema,
  nodeOperatorFeeBP: z
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  curatorFeeBP: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(1, INVALID_NUMBER_MIN_MESSAGE)
    .max(800, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
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

export const isZodError = (error: unknown): error is ZodError => {
  if (error instanceof ZodError) {
    return Array.isArray(error?.errors);
  }

  return false;
};

export const parseZodErrorSchema = (
  zodErrors: z.ZodIssue[],
  validateAllFieldCriteria: boolean,
) => {
  const errors: Record<string, FieldError> = {};
  for (const error of zodErrors) {
    const { code, message, path } = error;
    const _path = path.join('.');

    if (!errors[_path]) {
      if ('unionErrors' in error) {
        const unionError = error.unionErrors[0].errors[0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        };
      } else {
        errors[_path] = { message, type: code };
      }
    }

    if ('unionErrors' in error) {
      error.unionErrors.forEach((unionError) =>
        unionError.errors.forEach((e) => zodErrors.push(e)),
      );
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types;
      const messages = types && types[error.code];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as string[]).concat(messages as string[], error.message)
          : error.message,
      ) as FieldError;
    }
  }

  return errors;
};

export const createVaultFormValidator = <T extends ZodSchema>(
  schema: T,
): Resolver<z.infer<T>> => {
  return async (values: z.infer<T>) => {
    try {
      const output = schema.parse(values);
      return {
        values: output,
        errors: {},
      };
    } catch (err: unknown) {
      if (isZodError(err)) {
        const errors = err.errors;
        return {
          values,
          errors: parseZodErrorSchema(errors, true),
        };
      }

      return {
        values: values,
        errors: {},
      };
    }
  };
};

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
      ['nodeOperatorFeeBP', 'confirmExpiry', 'curatorFeeBP'].includes(key) &&
      typeof payload !== 'number'
    ) {
      errors[key] = {
        message: INVALID_NUMBER_DATA_MESSAGE,
      };
    }

    if (typeof payload === 'number') {
      if (key === 'nodeOperatorFeeBP') {
        if (payload < 0.001) {
          errors[key] = {
            message: INVALID_NUMBER_DATA_MESSAGE,
          };
        } else if (payload > 99) {
          errors[key] = {
            message: INVALID_NUMBER_MAX_MESSAGE,
          };
        } else if (values.curatorFeeBP + payload > 100) {
          errors[key] = {
            message: INVALID_NUMBER_SUM_MESSAGE,
          };
        }
      }

      if (key === 'confirmExpiry') {
        if (payload < 1) {
          errors[key] = {
            message: INVALID_NUMBER_DATA_MESSAGE,
          };
        }

        if (payload > 800) {
          errors[key] = {
            message: INVALID_NUMBER_EXPIRY_MAX_MESSAGE,
          };
        }
      }

      if (key === 'curatorFeeBP') {
        if (payload < 0.001) {
          errors[key] = {
            message: INVALID_NUMBER_DATA_MESSAGE,
          };
        }

        if (payload > 99) {
          errors[key] = {
            message: INVALID_NUMBER_MAX_MESSAGE,
          };
        }

        if (values.nodeOperatorFeeBP + payload > 100) {
          errors[key] = {
            message: INVALID_NUMBER_SUM_MESSAGE,
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
