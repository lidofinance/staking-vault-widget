import { isAddress } from 'viem';
import { z, ZodError, ZodSchema } from 'zod';
import {
  appendErrors,
  FieldError,
  Resolver,
  UseFormGetValues,
} from 'react-hook-form';
import { VaultPermissions } from 'features/settings/permissions/types';
import { isValidEns } from 'utils/ens';
import { EDITABLE_PERMISSIONS } from 'consts/roles';

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

export const editVaultValidator = <T extends ZodSchema>(
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
): Resolver<VaultPermissions> => {
  return async (values: VaultPermissions) => {
    const errors = {} as Record<
      EDITABLE_PERMISSIONS,
      Record<number, { value: string }>
    >;
    const keysList = Object.keys(values) as EDITABLE_PERMISSIONS[];

    await Promise.all(
      keysList.map(async (key: EDITABLE_PERMISSIONS) => {
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
