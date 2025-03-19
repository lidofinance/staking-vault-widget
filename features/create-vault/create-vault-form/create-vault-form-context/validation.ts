import { isAddress, PublicClient } from 'viem';
import { normalize } from 'viem/ens';
import { z, ZodError } from 'zod';
import { appendErrors, FieldError } from 'react-hook-form';
import { VaultFactoryArgs } from '../../../../types';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = 'Must be 0.001 or above';
const INVALID_NUMBER_MAX_MESSAGE = 'Must be 99 or less';
const INVALID_NUMBER_DATA_MESSAGE = { message: 'Only number is valid' };

const validateAddress = (value: string) => isAddress(value);

const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE });

export const createVaultSchema = z.object({
  nodeOperator: addressSchema,
  nodeOperatorManager: addressSchema,
  assetRecoverer: addressSchema,
  nodeOperatorFeeBP: z
    .number(INVALID_NUMBER_DATA_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  curatorFeeBP: z.coerce
    .number(INVALID_NUMBER_DATA_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_MESSAGE)
    .min(1, INVALID_NUMBER_MIN_MESSAGE)
    .max(800, 'Must be 800 or less'),
  defaultAdmin: addressSchema,
  confirmMainSettings: z.boolean(),
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
  curatorFeeSetters: z.array(addressSchema).optional(),
  curatorFeeClaimers: z.array(addressSchema).optional(),
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

export const createVaultFormValidator = async (values: CreateVaultSchema) => {
  try {
    const output = await createVaultSchema.parseAsync(values);
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

// TODO: move to shared validators
export const validateEnsDomain = async (
  value: string,
  publicClient: PublicClient,
) => {
  try {
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(value),
    });

    return !!ensAddress;
  } catch (e) {
    return false;
  }
};

export const formatCreateVaultData = (
  values: CreateVaultSchema,
): VaultFactoryArgs => {
  const { confirmMainSettings, nodeOperator, ...payload } = values;
  (payload as unknown as VaultFactoryArgs).confirmExpiry = BigInt(
    values.confirmExpiry,
  );
  return payload as unknown as VaultFactoryArgs;
};
