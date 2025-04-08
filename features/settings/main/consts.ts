import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';

export enum SubmittingMainFormStepsEnum {
  edit = 'edit',
  initiate = 'initiate',
  confirming = 'confirming',
  reject = 'reject',
  error = 'error',
  submitting = 'submitting',
  success = 'success',
}

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address-field';
const INVALID_NUMBER_MIN_MESSAGE = 'Must be 0.001 or above';
const INVALID_NUMBER_MAX_MESSAGE = 'Must be 99 or less';
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = 'Must be 800 or less';
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };

const addressSchema = z
  .string()
  .refine(isValidAnyAddress, { message: INVALID_ADDRESS_MESSAGE });

export const editMainSettingsSchema = z.object({
  nodeOperator: addressSchema,
  nodeOperatorManager: addressSchema,
  nodeOperatorFeeBP: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
    .min(1, INVALID_NUMBER_MIN_MESSAGE)
    .max(800, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
  defaultAdmin: addressSchema,
});
