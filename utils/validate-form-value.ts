import { z, ZodSchema } from 'zod';
import { type Address, isAddress } from 'viem';
import { Resolver } from 'react-hook-form';

import { isZodError } from 'utils/errors';
import { vaultTexts } from 'modules/vaults';

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
  .trim()
  .refine(validateAddress, {
    message: vaultTexts.common.errors.address.invalid,
  })
  .transform((value) => value.toLocaleLowerCase() as Address);

export const amountSchema = z
  .bigint({ message: vaultTexts.common.errors.amount.required })
  .min(1n, vaultTexts.common.errors.amount.min(0n));

export const supplyTokenSchema = z.enum(['ETH', 'wETH']);

export const mintTokenSchema = z.enum(['ETH', 'wETH']);
