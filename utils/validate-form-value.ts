import { z, ZodSchema } from 'zod';
import { type Address, isAddress, isAddressEqual } from 'viem';
import { appendErrors, FieldError, Resolver } from 'react-hook-form';

import { isZodError } from 'utils/errors';
import { vaultTexts } from 'modules/vaults';

// TODO: remove
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

// TODO: recheck with lib to remove this code
// https://react-hook-form.com/docs/useform#:~:text=of%20your%20fields.-,Examples%3A,-YUP
export const validateFormWithZod = <T extends ZodSchema>(
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

const validateAddress = (value: string | null) => !!(value && isAddress(value));

export const addressSchema = z
  .string()
  .nonempty({
    message: vaultTexts.common.errors.address.required,
  })
  .trim()
  .transform((value) => value.toLocaleLowerCase() as Address)
  .refine(validateAddress, {
    message: vaultTexts.common.errors.address.invalid,
  });

export const amountSchema = z
  .bigint({ message: vaultTexts.common.errors.amount.required })
  .min(1n, vaultTexts.common.errors.amount.min(0n));

export const supplyTokenSchema = z.enum(['ETH', 'wETH']);

export const mintTokenSchema = z.enum(['stETH', 'wstETH']);

export const maxAmountSchema = (maxAmount: bigint) =>
  amountSchema.lte(maxAmount, vaultTexts.common.errors.amount.max(maxAmount));

export type ValidateRecipientArgs = {
  vaultAddress: Address;
  dashboardAddress: Address;
};

export const validateRecipientSchema = ({
  dashboardAddress,
  vaultAddress,
}: ValidateRecipientArgs) =>
  addressSchema.pipe(
    z
      .string()
      .transform((value) => value as Address)
      .refine((val) => !isAddressEqual(val, vaultAddress), {
        message: vaultTexts.common.errors.address.vault,
      })
      .refine((val) => !isAddressEqual(val, dashboardAddress), {
        message: vaultTexts.common.errors.address.dashboard,
      }),
  );
