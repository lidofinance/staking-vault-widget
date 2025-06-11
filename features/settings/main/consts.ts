import { z } from 'zod';
import { getAddress } from 'viem';
import { FieldErrors, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import invariant from 'tiny-invariant';

import { isValidAnyAddress } from 'utils/address-validation';

import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  MAX_CONFIRM_EXPIRY,
  MAX_CONFIRM_EXPIRY_SECONDS,
  MIN_CONFIRM_EXPIRY,
  MIN_CONFIRM_EXPIRY_SECONDS,
  vaultTexts,
} from 'modules/vaults';

import {
  EditMainSettingsSchema,
  EditMainSettingsValues,
  MainSettingsDataContextValue,
  MainSettingsOverview,
} from './types';

export const DUPLICATED_ADDRESS_MESSAGE = 'Address already exists';
export const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Cannot exceed ${MAX_FEE_VALUE}%`;
const INVALID_NUMBER_EXPIRY_MIN_MESSAGE = `Must be ${MIN_CONFIRM_EXPIRY} or above`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };
const INVALID_EMPTY_STRING = 'Missing value';
const DUPLICATE_VALUE = 'Duplicate value';

export const accountSchema = z
  .string()
  .refine(isValidAnyAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((val) => getAddress(val));

export const addressSchema = z.object({
  isGranted: z.boolean().optional(),
  state: z.union([
    z.literal('remove'),
    z.literal('display'),
    z.literal('grant'),
  ]),
  value: accountSchema,
});

export const votingFeeSchema = z.coerce
  .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
  .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
  .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE);

export const votingLifetimeSchema = z.coerce
  .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
  .transform((val) => Number(val) * 3600)
  .refine(
    (seconds) => seconds >= MIN_CONFIRM_EXPIRY_SECONDS,
    INVALID_NUMBER_EXPIRY_MIN_MESSAGE,
  )
  .refine(
    (seconds) => seconds <= MAX_CONFIRM_EXPIRY_SECONDS,
    INVALID_NUMBER_EXPIRY_MAX_MESSAGE,
  );

export const editMainSettingsSchema = z.object({
  nodeOperatorManagers: z.array(addressSchema),
  defaultAdmins: z.array(addressSchema),
  nodeOperatorFeeBP: z.string(),
  nodeOperatorFeeBPCustom: z
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
    vaultKey: 'defaultAdmins',
    canEditRole: 'defaultAdmin',
    ...vaultTexts.actions.settings.fields.vaultManager,
  },
  {
    name: 'nodeOperatorManagers',
    dataType: 'address',
    vaultKey: 'nodeOperatorManagers',
    canEditRole: 'nodeOperatorManager',
    ...vaultTexts.actions.settings.fields.nodeOperatorManager,
  },
];

export const multipleDataFields = [
  'defaultAdmins',
  'nodeOperatorManagers',
] as const;

const baseValidation = zodResolver<
  EditMainSettingsValues,
  unknown,
  EditMainSettingsSchema
>(
  // TODO: find a way how to handle zod address type
  // @ts-expect-error zod Address type is not incompatible to string
  editMainSettingsSchema,
  { async: false },
  {
    mode: 'sync',
    raw: false,
  },
);

export const mainSettingsFormResolver: Resolver<
  EditMainSettingsValues,
  MainSettingsDataContextValue,
  EditMainSettingsSchema
> = async (values, context, options) => {
  const baseResult = await baseValidation(values, context, options as any);

  const errors: FieldErrors<EditMainSettingsSchema> = { ...baseResult.errors };

  handleCustomFieldErrors(baseResult.errors, errors, values);

  if (Object.keys(errors).length > 0) {
    return {
      values: baseResult.values,
      errors,
    };
  }
  invariant(context, '[mainSettingsFormResolver] context is undefined');

  checkForDuplicateValues(context, values, errors);

  return {
    values,
    errors,
  };
};

const handleCustomFieldErrors = (
  baseResultErrors: FieldErrors<EditMainSettingsValues>,
  errors: FieldErrors<EditMainSettingsSchema>,
  values: EditMainSettingsValues,
) => {
  const isNodeOperatorFeeBPCustom = values.nodeOperatorFeeBP === 'custom';
  const isConfirmExpiryCustom = values.confirmExpiry === 'custom';
  const isNodeOperatorFeeBPEmpty = values.nodeOperatorFeeBPCustom === '';
  const isConfirmExpiryEmpty = values.confirmExpiryCustom === '';

  if (isNodeOperatorFeeBPCustom && baseResultErrors.nodeOperatorFeeBPCustom) {
    errors.nodeOperatorFeeBPCustom = baseResultErrors.nodeOperatorFeeBPCustom;
  } else {
    delete errors.nodeOperatorFeeBPCustom;
  }

  if (isConfirmExpiryCustom && baseResultErrors.confirmExpiryCustom) {
    errors.confirmExpiryCustom = baseResultErrors.confirmExpiryCustom;
  } else {
    delete errors.confirmExpiryCustom;
  }

  if (isNodeOperatorFeeBPCustom && isNodeOperatorFeeBPEmpty) {
    errors.nodeOperatorFeeBPCustom = {
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
  context: MainSettingsDataContextValue,
  values: EditMainSettingsValues,
  errors: FieldErrors<EditMainSettingsSchema>,
) => {
  const { nodeOperatorFeeBP, confirmExpiry } = context;

  const uniqueNodeOperatorFeeBP = nodeOperatorFeeBP
    .filter((item) => item.type !== 'custom')
    .map((item) => Number(item.value));
  const uniqueConfirmExpiry = confirmExpiry
    .filter((item) => item.type !== 'custom')
    .map((item) => Number(item.value));

  const isNodeOperatorFeeBPDuplicate = uniqueNodeOperatorFeeBP.includes(
    Number(values.nodeOperatorFeeBPCustom),
  );
  const isConfirmExpiryDuplicate = uniqueConfirmExpiry.includes(
    Number(values.confirmExpiryCustom ?? '') * 3600,
  );

  if (isNodeOperatorFeeBPDuplicate) {
    errors.nodeOperatorFeeBPCustom = {
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
