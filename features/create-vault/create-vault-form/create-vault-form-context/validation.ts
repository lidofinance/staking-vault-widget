import { isAddress } from 'viem';
import { z, ZodError, ZodSchema } from 'zod';
import {
  appendErrors,
  FieldError,
  Resolver,
  UseFormGetValues,
} from 'react-hook-form';
import {
  MainSettingsKeys,
  PermissionKeys,
  VaultMainSettingsType,
  VaultPermissionsType,
} from 'features/create-vault/types';
import { isValidAnyAddress } from 'utils/address-validation';
import { isValidEns } from 'utils/ens';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = 'Must be 0.01 or above';
const INVALID_NUMBER_MAX_MESSAGE = 'Must be 99 or less';
const INVALID_NUMBER_SUM_MESSAGE =
  "Sum of Curator's and Node Operator's fees can't be more than 100";
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = 'Must be 720 or less';
const INVALID_NUMBER_DATA_MESSAGE = 'Only number is valid';
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };

const validateAddress = (value: string) => isValidAnyAddress(value);

const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE });

export const createVaultSchema = z.object({
  nodeOperator: addressSchema,
  nodeOperatorManager: addressSchema,
  assetRecoverer: addressSchema,
  nodeOperatorFeeBP: z
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(0.01, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  curatorFeeBP: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(0.01, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(1, INVALID_NUMBER_MIN_MESSAGE)
    .max(720, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
  defaultAdmin: addressSchema,
  funders: z.array(addressSchema).optional(),
  withdrawers: z.array(addressSchema).optional(),
  minters: z.array(addressSchema).optional(),
  burners: z.array(addressSchema).optional(),
  rebalancers: z.array(addressSchema).optional(),
  depositPausers: z.array(addressSchema).optional(),
  depositResumers: z.array(addressSchema).optional(),
  validatorExitRequesters: z.array(addressSchema).optional(),
  validatorWithdrawalTriggerers: z.array(addressSchema).optional(),
  disconnecters: z.array(addressSchema).optional(),
  curatorFeeSetters: z.array(addressSchema).optional(), // TODO: Will be removed
  curatorFeeClaimers: z.array(addressSchema).optional(), // TODO: Will be removed
  nodeOperatorFeeClaimers: z.array(addressSchema).optional(),
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

export const validatePermissions = (
  getValues: UseFormGetValues<Record<string, any>>,
): Resolver<VaultPermissionsType> => {
  return async (values: VaultPermissionsType) => {
    const errors = {} as Record<
      PermissionKeys,
      Record<number, { value: string }>
    >;
    const keysList = Object.keys(values) as PermissionKeys[];

    await Promise.all(
      keysList.map(async (key: PermissionKeys) => {
        const payload = values[key];
        errors[key] = {};

        await Promise.all(
          payload.map(async (field, index) => {
            const { value: currentValue } = field;

            if (!isAddress(currentValue)) {
              const isValid = isValidEns(currentValue);

              if (!isValid) {
                errors[key][`${index}`] = {
                  value: 'Invalid ethereum address',
                };
              }
            }

            const mainFormValues = getValues(key) as string[];
            const filtered = mainFormValues.filter(
              (value) => value === currentValue,
            );

            if (filtered.length > 0) {
              errors[key][index] = {
                value: 'Address already added',
              };
            }
          }),
        );
      }),
    );

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
