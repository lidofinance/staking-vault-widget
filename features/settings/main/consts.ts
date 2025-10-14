import { z } from 'zod';
import { FieldErrors, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import invariant from 'tiny-invariant';

import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  MAX_CONFIRM_EXPIRY,
  MAX_CONFIRM_EXPIRY_SECONDS,
  MIN_CONFIRM_EXPIRY,
  MIN_CONFIRM_EXPIRY_SECONDS,
  vaultTexts,
} from 'modules/vaults';

import type {
  MainSettingsFormValidatedValues,
  MainSettingFormsValues,
  MainSettingsFormData,
  MainSettingsOverview,
} from './types';
import { addressSchema } from 'utils/zod-validation';
import { awaitWithTimeout } from 'utils/await-with-timeout';

export const DUPLICATED_ADDRESS_MESSAGE = 'Address already exists';
export const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Cannot exceed ${MAX_FEE_VALUE}%`;
const INVALID_NUMBER_EXPIRY_MIN_MESSAGE = `Must be ${MIN_CONFIRM_EXPIRY} or above`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };
const INVALID_INT_NUMBER_DATA_OBJECT_MESSAGE = {
  message: 'Only integer number is valid',
};
const INVALID_EMPTY_STRING = 'Missing value';
const DUPLICATE_VALUE = 'Duplicate value';

const permissionSchema = z.object({
  isGranted: z.boolean().optional(),
  state: z.union([
    z.literal('remove'),
    z.literal('display'),
    z.literal('grant'),
  ]),
  value: addressSchema,
});

const votingFeeSchema = z.coerce
  .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
  .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
  .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE);

const votingLifetimeSchema = z.coerce
  .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
  .int(INVALID_INT_NUMBER_DATA_OBJECT_MESSAGE)
  .transform((val) => Number(val) * 3600)
  .refine(
    (seconds) => seconds >= MIN_CONFIRM_EXPIRY_SECONDS,
    INVALID_NUMBER_EXPIRY_MIN_MESSAGE,
  )
  .refine(
    (seconds) => seconds <= MAX_CONFIRM_EXPIRY_SECONDS,
    INVALID_NUMBER_EXPIRY_MAX_MESSAGE,
  );

export const mainSettingsFormSchema = z.object({
  nodeOperatorManagers: z.array(permissionSchema),
  feeRecipient: addressSchema,
  defaultAdmins: z.array(permissionSchema),
  feeRate: z.string(),
  isDepositAllowed: z.boolean(),
  nodeOperatorFeeRateCustom: z
    .string()
    .pipe(votingFeeSchema)
    .transform((val) => String(val))
    .optional(),

  confirmExpiry: z.string(),
  confirmExpiryCustom: z
    .string()
    .pipe(votingLifetimeSchema)
    .transform((val) => String(val))
    .optional(),
});

export const adminsForRender: MainSettingsOverview[] = [
  {
    name: 'defaultAdmins',
    dataType: 'address',
    canEditRole: 'defaultAdmin',
    dataTestId: 'vaultOwner',
    ...vaultTexts.actions.settings.fields.vaultManager,
  },
  {
    name: 'nodeOperatorManagers',
    dataType: 'address',
    canEditRole: 'nodeOperatorManager',
    dataTestId: 'nodeOperatorManager',
    ...vaultTexts.actions.settings.fields.nodeOperatorManager,
  },
];

export const multipleDataFields = [
  'defaultAdmins',
  'nodeOperatorManagers',
] as const;

const baseValidation = zodResolver<
  MainSettingFormsValues,
  unknown,
  MainSettingsFormValidatedValues
>(
  mainSettingsFormSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const mainSettingsFormResolver: Resolver<
  MainSettingFormsValues,
  Promise<MainSettingsFormData>,
  MainSettingsFormValidatedValues
> = async (values, awaitableContext, options) => {
  const baseResult = await baseValidation(values, undefined, options);

  const errors: FieldErrors<MainSettingsFormValidatedValues> = {
    ...baseResult.errors,
  };

  handleCustomFieldErrors(baseResult.errors, errors, values);

  if (Object.keys(errors).length > 0) {
    return {
      values: baseResult.values,
      errors,
    };
  }
  invariant(
    awaitableContext,
    '[mainSettingsFormResolver] context is undefined',
  );
  const context = await awaitWithTimeout(awaitableContext, 4000);

  checkForDuplicateValues(context, values, errors);

  return {
    values,
    errors,
  };
};

const handleCustomFieldErrors = (
  baseResultErrors: FieldErrors<MainSettingFormsValues>,
  errors: FieldErrors<MainSettingsFormValidatedValues>,
  values: MainSettingFormsValues,
) => {
  const isnodeOperatorFeeRateCustom = values.feeRate === 'custom';
  const isConfirmExpiryCustom = values.confirmExpiry === 'custom';
  const isnodeOperatorFeeRateEmpty = values.nodeOperatorFeeRateCustom === '';
  const isConfirmExpiryEmpty = values.confirmExpiryCustom === '';

  if (
    isnodeOperatorFeeRateCustom &&
    baseResultErrors.nodeOperatorFeeRateCustom
  ) {
    errors.nodeOperatorFeeRateCustom =
      baseResultErrors.nodeOperatorFeeRateCustom;
  } else {
    delete errors.nodeOperatorFeeRateCustom;
  }

  if (isConfirmExpiryCustom && baseResultErrors.confirmExpiryCustom) {
    errors.confirmExpiryCustom = baseResultErrors.confirmExpiryCustom;
  } else {
    delete errors.confirmExpiryCustom;
  }

  if (isnodeOperatorFeeRateCustom && isnodeOperatorFeeRateEmpty) {
    errors.nodeOperatorFeeRateCustom = {
      type: 'custom',
      message: INVALID_EMPTY_STRING,
    };
  }
  if (isConfirmExpiryCustom && isConfirmExpiryEmpty) {
    errors.confirmExpiryCustom = {
      type: 'custom',
      message: INVALID_EMPTY_STRING,
    };
  }
};

const checkForDuplicateValues = (
  context: MainSettingsFormData,
  values: MainSettingFormsValues,
  errors: FieldErrors<MainSettingsFormValidatedValues>,
) => {
  const { feeRate, confirmExpiry } = context;

  const uniqueNodeOperatorFeeRate = feeRate
    .filter((item) => item.type !== 'custom')
    .map((item) => Number(item.value));
  const uniqueConfirmExpiry = confirmExpiry
    .filter((item) => item.type !== 'custom')
    .map((item) => Number(item.value));

  const isNodeOperatorFeeRateDuplicate = uniqueNodeOperatorFeeRate
    .map((rate) => `${rate}`)
    .includes(values.nodeOperatorFeeRateCustom ?? '');

  const isConfirmExpiryDuplicate = uniqueConfirmExpiry.includes(
    Number(values.confirmExpiryCustom ?? '') * 3600,
  );

  if (isNodeOperatorFeeRateDuplicate) {
    errors.nodeOperatorFeeRateCustom = {
      type: 'custom',
      message: DUPLICATE_VALUE,
    };
  }
  if (isConfirmExpiryDuplicate) {
    errors.confirmExpiryCustom = {
      type: 'custom',
      message: DUPLICATE_VALUE,
    };
  }
};
