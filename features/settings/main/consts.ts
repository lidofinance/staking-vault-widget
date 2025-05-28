import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';
import {
  MainSettingsOverview,
  MainSettingsVoting,
  ManagersKeys,
  ManagersNewAddresses,
  RoleFieldSchema,
  TxData,
} from './types';
import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  MAX_CONFIRM_EXPIRY,
  MIN_CONFIRM_EXPIRY,
} from 'modules/vaults';
import { Address, isAddress } from 'viem';
import { Resolver, UseFormGetValues } from 'react-hook-form';
import { isValidEns } from 'utils/ens';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = `Must be ${MIN_FEE_VALUE} or above`;
const INVALID_NUMBER_MAX_MESSAGE = `Must be ${MAX_FEE_VALUE} or less`;
const INVALID_NUMBER_EXPIRY_MIN_MESSAGE = `Must be ${MIN_CONFIRM_EXPIRY} or above`;
const INVALID_NUMBER_EXPIRY_MAX_MESSAGE = `Must be ${MAX_CONFIRM_EXPIRY} or less`;
const INVALID_NUMBER_DATA_OBJECT_MESSAGE = { message: 'Only number is valid' };

const accountSchema = z
  .string()
  .refine(isValidAnyAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((value) => value as Address);

export const addressSchema = z.object({
  isGranted: z.boolean().optional(),
  state: z.union([
    z.literal('remove'),
    z.literal('display'),
    z.literal('grant'),
  ]),
  value: accountSchema,
});

export const votingBase = z.object({
  value: z.coerce.number(INVALID_NUMBER_DATA_OBJECT_MESSAGE), // сюда позже добавим min/max
  expiryDate: z.date().optional(),
  type: z
    .union([
      z.literal('current'),
      z.literal('edit'),
      z.literal('to_me'),
      z.literal('by_me'),
    ])
    .optional(),
});

export const votingFeeSchema = votingBase.extend({
  value: votingBase.shape.value
    .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
    .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE),
});

export const votingLifetimeSchema = votingBase.extend({
  value: votingBase.shape.value
    .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MIN_MESSAGE)
    .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
});

export const editMainSettingsSchema = z
  .object({
    nodeOperatorManagers: z.array(addressSchema),
    defaultAdmins: z.array(addressSchema),
    nodeOperatorFeeBPCustom: z.coerce
      .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
      .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
      .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE)
      .optional(),
    nodeOperatorFeeBP: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          const n = parseInt(val, 10);
          return isNaN(n) ? val : n;
        }
        return val;
      },
      z.union([
        z
          .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
          .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
          .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE),
        z.literal('other'),
      ]),
    ),
    confirmExpiryCustom: z.coerce
      .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
      .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MIN_MESSAGE)
      .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE)
      .optional(),
    confirmExpiry: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          const n = parseInt(val, 10);
          return isNaN(n) ? val : n;
        }
        return val;
      },
      z.union([
        z
          .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
          .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MIN_MESSAGE)
          .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
        z.literal('other'),
      ]),
    ),
  })
  .superRefine((data, ctx) => {
    const {
      confirmExpiry,
      confirmExpiryCustom,
      nodeOperatorFeeBP,
      nodeOperatorFeeBPCustom,
    } = data;

    if (confirmExpiry === 'other' && confirmExpiryCustom == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add value',
        path: ['confirmExpiryCustom'],
      });
    } else if (
      nodeOperatorFeeBP === 'other' &&
      nodeOperatorFeeBPCustom == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add value',
        path: ['nodeOperatorFeeBPCustom'],
      });
    }
  });

export const indicatorsForRender: MainSettingsVoting[] = [
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    editLabel: 'Propose new, %',
    mask: '%',
    vaultKey: 'nodeOperatorFeeBP',
    canEditRole: 'confirmingRoles',
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    editLabel: 'Propose new, hours',
    mask: ' hours',
    vaultKey: 'confirmExpiry',
    canEditRole: 'confirmingRoles',
  },
];

export const adminsForRender: MainSettingsOverview[] = [
  {
    name: 'defaultAdmins',
    title: 'Vault Manager',
    editLabel: 'Vault Manager address',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'defaultAdmins',
    canEditRole: 'defaultAdmin',
  },
  {
    name: 'nodeOperatorManagers',
    title: 'Node Operator Manager',
    editLabel: 'Node Operator Manager address',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'nodeOperatorManagers',
    canEditRole: 'nodeOperatorManager',
  },
];

export const dashboardFunctionsNamesMap: Record<
  keyof TxData,
  'grantRoles' | 'revokeRoles' | 'setConfirmExpiry' | 'setNodeOperatorFeeBP'
> = {
  grantRoles: 'grantRoles',
  revokeRoles: 'revokeRoles',
  confirmExpiry: 'setConfirmExpiry',
  nodeOperatorFeeBP: 'setNodeOperatorFeeBP',
};

export const multipleDataFields = ['defaultAdmins', 'nodeOperatorManagers'];

export const validateManagers = (
  getValues: UseFormGetValues<Record<string, any>>,
): Resolver<ManagersNewAddresses> => {
  return async (values) => {
    const addresses = values.addresses;
    const errors = { addresses: {} } as {
      addresses: Record<
        ManagersKeys,
        Record<number, { value: { message: string } }>
      >;
    };

    const keysList = Object.keys(addresses) as ManagersKeys[];

    keysList.forEach((key: ManagersKeys) => {
      const payload = addresses[key] ?? [];
      errors.addresses[key] = {};

      payload.forEach((field, index) => {
        const { value: currentValue } = field;

        if (!isAddress(currentValue)) {
          const isValid = isValidEns(currentValue);

          if (!isValid) {
            errors.addresses[key][index] = {
              value: {
                message: 'Invalid ethereum address',
              },
            };
          }
        }

        const mainFormValues = getValues(key) as RoleFieldSchema[];
        const filtered = (mainFormValues ?? []).filter(
          (item) => item.value === currentValue,
        );

        if (filtered.length > 0) {
          errors.addresses[key][index] = {
            value: {
              message: 'Address already added',
            },
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
