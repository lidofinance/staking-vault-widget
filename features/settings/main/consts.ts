import { z } from 'zod';
import { isValidAnyAddress } from 'utils/address-validation';
import { MainSettingsOverview, TxData } from './types';
import {
  MIN_FEE_VALUE,
  MAX_FEE_VALUE,
  MAX_CONFIRM_EXPIRY,
  MIN_CONFIRM_EXPIRY,
} from 'modules/vaults';
import { Address } from 'viem';

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

export const editMainSettingsSchema = z.object({
  nodeOperatorManagers: z.array(addressSchema),
  nodeOperatorFeeBP: z.array(
    z.object({
      value: z.coerce
        .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
        .min(MIN_FEE_VALUE, INVALID_NUMBER_MIN_MESSAGE)
        .max(MAX_FEE_VALUE, INVALID_NUMBER_MAX_MESSAGE),
    }),
  ),
  confirmExpiry: z.array(
    z.object({
      value: z.coerce
        .number(INVALID_NUMBER_DATA_OBJECT_MESSAGE)
        .min(MIN_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MIN_MESSAGE)
        .max(MAX_CONFIRM_EXPIRY, INVALID_NUMBER_EXPIRY_MAX_MESSAGE),
    }),
  ),
  defaultAdmins: z.array(addressSchema),
});

export const fieldsForRender: MainSettingsOverview[] = [
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Current Node Operator fee, %',
    editLabel: 'Propose new Node Operator fee, %',
    dataType: 'percent',
    vaultKey: 'nodeOperatorFeeBP',
    canEditRole: 'confirmingRoles',
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Current Confirmation Life Time, hours',
    editLabel: 'Propose new Сonfirmation Lifetime, hours',
    dataType: 'time',
    vaultKey: 'confirmExpiry',
    canEditRole: 'confirmingRoles',
  },
  {
    name: 'defaultAdmins',
    title: 'Vault Manager',
    label: 'Vault Manager address',
    editLabel: 'Vault Manager address',
    dataType: 'address',
    actionText: 'Add new address',
    vaultKey: 'defaultAdmins',
    canEditRole: 'defaultAdmin',
  },
  {
    name: 'nodeOperatorManagers',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address',
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
